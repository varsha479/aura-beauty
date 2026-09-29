import { useCallback, useEffect, useRef, useState } from "react"
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"
import useRouteMetadata from "../hooks/useRouteMetadata"
import { catalogItems, routeDescriptions } from "../data/catalog"
import { useCart } from "../context/CartContext"
import "./VirtualStudio.css"

const VISION_WASM_URL = "/vision"
const FACE_MODEL_URL = "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"

const landmarks = { leftCheek: 234, rightCheek: 454, forehead: 10, chin: 152, leftJaw: 172, rightJaw: 397, upperLip: 13, lowerLip: 14 }
const lipShades = [
  { name: "Beige Avenue", hex: "#b85b43" },
  { name: "Needful", hex: "#ad4935" },
  { name: "Active Lady", hex: "#a44232" },
  { name: "Peach Tease", hex: "#bf5e4b" },
  { name: "Live A Little", hex: "#8f2d20" },
  { name: "Cutesicle", hex: "#e76073" },
  { name: "Blossom Day", hex: "#d9435d" },
  { name: "Pinkalicious", hex: "#c93350" },
  { name: "Carrot Pink", hex: "#d63d43" },
  { name: "Fairy Cake", hex: "#a72d48" },
  { name: "Immanence", hex: "#8e211c" },
  { name: "Macaron Red", hex: "#b8291e" },
]
const eyeShades = [
  { name: "Copper Spark", hex: "#9d3128" },
  { name: "Rose Satin", hex: "#b76d6d" },
  { name: "Pearl Rose", hex: "#d8aaa5" },
  { name: "Ruby Rose", hex: "#b83e43" },
  { name: "Berry Shimmer", hex: "#ab4652" },
  { name: "Brick Rose", hex: "#99534e" },
  { name: "Deep Berry", hex: "#6f2f36" },
  { name: "Copper Rose", hex: "#b86050" },
  { name: "Red Velvet", hex: "#a92f2b" },
]
const cheekShades = [
  { name: "Soft Sand", hex: "#c98f78" },
  { name: "Apricot Veil", hex: "#d98b78" },
  { name: "Muted Rose", hex: "#c87578" },
  { name: "Warm Petal", hex: "#b96762" },
]

function point(face, index, width, height) {
  const landmark = face[index]
  return landmark ? { x: landmark.x * width, y: landmark.y * height } : null
}

function getAnalysis(face, video, frameCanvas) {
  const width = video.videoWidth
  const height = video.videoHeight
  const forehead = point(face, landmarks.forehead, width, height)
  const chin = point(face, landmarks.chin, width, height)
  const leftCheek = point(face, landmarks.leftCheek, width, height)
  const rightCheek = point(face, landmarks.rightCheek, width, height)
  const leftJaw = point(face, landmarks.leftJaw, width, height)
  const rightJaw = point(face, landmarks.rightJaw, width, height)
  const faceHeight = Math.abs(chin.y - forehead.y)
  const faceWidth = Math.abs(rightCheek.x - leftCheek.x)
  const jawWidth = Math.abs(rightJaw.x - leftJaw.x)
  const ratio = faceHeight / faceWidth
  const shape = ratio > 1.48 ? "Oblong" : ratio < 1.12 && jawWidth > faceWidth * 0.8 ? "Round" : jawWidth < faceWidth * 0.68 ? "Heart" : "Oval"

  const sample = frameCanvas.getContext("2d", { willReadFrequently: true })
  sample.drawImage(video, 0, 0, 32, 32)
  const pixels = sample.getImageData(12, 14, 8, 6).data
  let red = 0
  let blue = 0
  for (let index = 0; index < pixels.length; index += 4) {
    red += pixels[index]
    blue += pixels[index + 2]
  }
  const undertone = red / Math.max(blue, 1) > 1.12 ? "Warm" : blue / Math.max(red, 1) > 0.92 ? "Cool" : "Neutral"
  return { shape, undertone }
}

function fillPath(context, face, indices, width, height) {
  const points = indices.map((index) => point(face, index, width, height))
  context.beginPath()
  points.forEach((item, index) => {
    if (index === 0) context.moveTo(item.x, item.y)
    else context.lineTo(item.x, item.y)
  })
  context.closePath()
  context.fill()
}

function clipPath(context, face, indices, width, height) {
  const points = indices.map((index) => point(face, index, width, height))
  context.beginPath()
  points.forEach((item, index) => {
    if (index === 0) context.moveTo(item.x, item.y)
    else context.lineTo(item.x, item.y)
  })
  context.closePath()
  context.clip()
}

function smoothPath(context, points) {
  context.beginPath()
  const firstMidpoint = {
    x: (points[points.length - 1].x + points[0].x) / 2,
    y: (points[points.length - 1].y + points[0].y) / 2,
  }
  context.moveTo(firstMidpoint.x, firstMidpoint.y)
  points.forEach((item, index) => {
    const next = points[(index + 1) % points.length]
    const midpoint = { x: (item.x + next.x) / 2, y: (item.y + next.y) / 2 }
    context.quadraticCurveTo(item.x, item.y, midpoint.x, midpoint.y)
  })
  context.closePath()
}

function clipSmoothPath(context, face, indices, width, height) {
  smoothPath(context, indices.map((index) => point(face, index, width, height)))
  context.clip()
}

function clipSmoothPoints(context, points) {
  smoothPath(context, points)
  context.clip()
}

function drawOverlay(context, face, width, height, makeup) {
  const cheekLeft = point(face, landmarks.leftCheek, width, height)
  const cheekRight = point(face, landmarks.rightCheek, width, height)
  const nose = point(face, 1, width, height)
  context.clearRect(0, 0, width, height)
  const cheekGradient = (center) => {
    const gradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y, width * 0.105)
    gradient.addColorStop(0, makeup.cheekShade)
    gradient.addColorStop(0.3, `${makeup.cheekShade}cc`)
    gradient.addColorStop(0.68, `${makeup.cheekShade}45`)
    gradient.addColorStop(1, `${makeup.cheekShade}00`)
    return gradient
  }
  ;[cheekLeft, cheekRight].forEach((cheek) => {
    const center = {
      x: cheek.x + (nose.x - cheek.x) * 0.32,
      y: cheek.y + (nose.y - cheek.y) * 0.12 - height * 0.02,
    }
    context.save()
    context.globalCompositeOperation = "soft-light"
    context.globalAlpha = makeup.cheekOpacity * 0.9
    context.filter = `blur(${Math.max(3, width * 0.012)}px)`
    context.fillStyle = cheekGradient(center)
    context.fillRect(center.x - width * 0.12, center.y - height * 0.1, width * 0.24, height * 0.2)
    context.restore()
  })

  const eyeMask = (upperLid, brow, centerIndex) => {
    const lidPoints = upperLid.map((index) => point(face, index, width, height))
    const browPoints = brow.map((index) => point(face, index, width, height))
    const lidCenter = lidPoints.reduce((sum, item) => ({ x: sum.x + item.x, y: sum.y + item.y }), { x: 0, y: 0 })
    const browCenter = browPoints.reduce((sum, item) => ({ x: sum.x + item.x, y: sum.y + item.y }), { x: 0, y: 0 })
    lidCenter.x /= lidPoints.length
    lidCenter.y /= lidPoints.length
    browCenter.x /= browPoints.length
    browCenter.y /= browPoints.length
    const offset = { x: (browCenter.x - lidCenter.x) * 0.42, y: (browCenter.y - lidCenter.y) * 0.42 }
    const shadowPath = [...lidPoints, ...lidPoints.map((item) => ({ x: item.x + offset.x, y: item.y + offset.y })).reverse()]
    const center = point(face, centerIndex, width, height)
    const paint = (blendMode, opacity) => {
      context.save()
      context.globalCompositeOperation = blendMode
      context.globalAlpha = makeup.eyeOpacity * opacity * 0.7
      context.filter = `blur(${Math.max(2, width * 0.005)}px)`
      const gradient = context.createRadialGradient(center.x, center.y, 0, center.x, center.y + offset.y, width * 0.1)
      gradient.addColorStop(0, makeup.eyeShade)
      gradient.addColorStop(0.45, makeup.eyeShade)
      gradient.addColorStop(0.82, `${makeup.eyeShade}55`)
      gradient.addColorStop(1, `${makeup.eyeShade}00`)
      context.fillStyle = gradient
      smoothPath(context, shadowPath)
      context.fill()
      context.restore()
    }
    paint("multiply", 0.42)
    paint("soft-light", 0.22)
  }
  eyeMask(
    [33, 246, 161, 160, 159, 158, 157, 173, 133],
    [70, 63, 105, 66, 107],
    159,
  )
  eyeMask(
    [263, 466, 388, 387, 386, 385, 384, 398, 362],
    [336, 296, 334, 293, 300],
    386,
  )

  const lipPaths = [
    [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78],
    [291, 375, 321, 405, 314, 17, 84, 181, 91, 146, 61, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308],
  ]
  const lipCenter = point(face, landmarks.upperLip, width, height)
  lipPaths.forEach((path) => {
    context.save()
    context.globalCompositeOperation = "multiply"
    context.globalAlpha = makeup.lipOpacity * 0.72
    context.filter = `blur(${Math.max(2, width * 0.006)}px)`
    const gradient = context.createRadialGradient(lipCenter.x, lipCenter.y, 0, lipCenter.x, lipCenter.y, width * 0.16)
    gradient.addColorStop(0, makeup.lipShade)
    gradient.addColorStop(0.62, makeup.lipShade)
    gradient.addColorStop(0.9, `${makeup.lipShade}55`)
    gradient.addColorStop(1, `${makeup.lipShade}00`)
    context.fillStyle = gradient
    smoothPath(context, path.map((index) => point(face, index, width, height)))
    context.fill()
    context.restore()
  })
}

function findProduct(slug) {
  return catalogItems.find((item) => item.slug === slug)
}

export default function VirtualStudio() {
  const videoRef = useRef(null)
  const overlayRef = useRef(null)
  const captureRef = useRef(null)
  const streamRef = useRef(null)
  const landmarkerRef = useRef(null)
  const animationRef = useRef(null)
  const activeRef = useRef(false)
  const startingRef = useRef(false)
  const cameraReadyRef = useRef(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [status, setStatus] = useState("Preparing your studio")
  const [error, setError] = useState("")
  const [analysis, setAnalysis] = useState(null)
  const [capturedImage, setCapturedImage] = useState("")
  const [selectedLipShade, setSelectedLipShade] = useState(lipShades[0])
  const [selectedEyeShade, setSelectedEyeShade] = useState(eyeShades[0])
  const [selectedCheekShade, setSelectedCheekShade] = useState(cheekShades[0])
  const [lipOpacity, setLipOpacity] = useState(0.23)
  const [cheekOpacity, setCheekOpacity] = useState(0.23)
  const [eyeOpacity, setEyeOpacity] = useState(0.23)
  const selectedLipShadeRef = useRef(lipShades[0])
  const makeupRef = useRef({ lipShade: lipShades[0].hex, eyeShade: eyeShades[0].hex, cheekShade: cheekShades[0].hex, lipOpacity: 0.23, cheekOpacity: 0.23, eyeOpacity: 0.23 })
  const { addToCart } = useCart()
  useRouteMetadata({
    title: "AURA | Virtual Studio",
    description: routeDescriptions.studio,
  })

  const analyzeFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = overlayRef.current
    const landmarker = landmarkerRef.current
    if (!activeRef.current || !video || !canvas || !landmarker || video.readyState < 2) {
      animationRef.current = requestAnimationFrame(analyzeFrame)
      return
    }
    const width = video.videoWidth
    const height = video.videoHeight
    canvas.width = width
    canvas.height = height
    let result
    try {
      result = landmarker.detectForVideo(video, performance.now())
    } catch {
      setError("Face analysis paused, but camera capture is still available.")
      landmarkerRef.current = null
      animationRef.current = requestAnimationFrame(analyzeFrame)
      return
    }
    const context = canvas.getContext("2d")
    if (result.faceLandmarks.length) {
      const face = result.faceLandmarks[0]
      drawOverlay(context, face, width, height, makeupRef.current)
      setAnalysis((current) => current || getAnalysis(face, video, captureRef.current))
      setStatus("Face detected · live try-on ready")
    } else {
      context.clearRect(0, 0, width, height)
      setStatus("Center your face inside the frame")
    }
    animationRef.current = requestAnimationFrame(analyzeFrame)
  }, [])

  const startStudio = useCallback(async () => {
    if (activeRef.current || startingRef.current) return
    startingRef.current = true
    setError("")
    setStatus("Requesting camera access")
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access requires localhost or HTTPS in a supported browser.")
      }
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      await videoRef.current.play()
      activeRef.current = true
      cameraReadyRef.current = true
      setCameraReady(true)
      setStatus("Camera ready · center your face for analysis")

      try {
        const visionFiles = await FilesetResolver.forVisionTasks(VISION_WASM_URL)
        try {
          landmarkerRef.current = await FaceLandmarker.createFromOptions(visionFiles, {
            baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: "GPU" },
            runningMode: "VIDEO",
            numFaces: 1,
            minFaceDetectionConfidence: 0.6,
            minFacePresenceConfidence: 0.6,
            minTrackingConfidence: 0.6,
          })
        } catch {
          landmarkerRef.current = await FaceLandmarker.createFromOptions(visionFiles, {
            baseOptions: { modelAssetPath: FACE_MODEL_URL, delegate: "CPU" },
            runningMode: "VIDEO",
            numFaces: 1,
          })
        }
        animationRef.current = requestAnimationFrame(analyzeFrame)
      } catch (visionError) {
        setStatus("Camera ready · capture is available")
        setError(`Face analysis could not start: ${visionError.message || "vision model unavailable"}. Camera capture is still available.`)
      }
    } catch (cameraError) {
      setError(cameraError.name === "NotAllowedError" ? "Camera access was blocked. Allow camera access in your browser, then press Restart camera." : cameraError.message || "The studio could not start. Check your camera and connection, then try again.")
      setStatus("Studio paused")
    } finally {
      startingRef.current = false
    }
  }, [analyzeFrame])

  useEffect(() => {
    startStudio()
    return () => {
      activeRef.current = false
      startingRef.current = false
      cameraReadyRef.current = false
      cancelAnimationFrame(animationRef.current)
      streamRef.current?.getTracks().forEach((track) => track.stop())
      landmarkerRef.current?.close()
    }
  }, [startStudio])

  const captureLook = () => {
    const video = videoRef.current
    if (!video || !cameraReadyRef.current || video.readyState < 2) {
      setError("Wait for the camera preview to become ready, then capture again.")
      return
    }
    const canvas = captureRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const context = canvas.getContext("2d")
    context.drawImage(video, 0, 0)
    context.drawImage(overlayRef.current, 0, 0)
    setCapturedImage(canvas.toDataURL("image/jpeg", 0.9))
  }

  const selectLipShade = (shade) => {
    selectedLipShadeRef.current = shade
    makeupRef.current = { ...makeupRef.current, lipShade: shade.hex }
    setSelectedLipShade(shade)
  }

  const selectEyeShade = (shade) => {
    makeupRef.current = { ...makeupRef.current, eyeShade: shade.hex }
    setSelectedEyeShade(shade)
  }

  const selectCheekShade = (shade) => {
    makeupRef.current = { ...makeupRef.current, cheekShade: shade.hex }
    setSelectedCheekShade(shade)
  }

  const updateOpacity = (type, value) => {
    makeupRef.current = { ...makeupRef.current, [type]: Number(value) }
    if (type === "lipOpacity") setLipOpacity(Number(value))
    if (type === "cheekOpacity") setCheekOpacity(Number(value))
    if (type === "eyeOpacity") setEyeOpacity(Number(value))
  }

  const restartStudio = async () => {
    activeRef.current = false
    cameraReadyRef.current = false
    setCameraReady(false)
    cancelAnimationFrame(animationRef.current)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    landmarkerRef.current?.close()
    landmarkerRef.current = null
    setAnalysis(null)
    setCapturedImage("")
    setStatus("Restarting camera")
    await startStudio()
  }

  const recommendations = analysis
    ? [
        { label: "Complexion", shade: analysis.undertone === "Cool" ? "Porcelain Rose" : analysis.undertone === "Warm" ? "Golden Veil" : "Neutral Linen", text: `${analysis.undertone} undertone · luminous, breathable coverage`, product: findProduct("lumiere-foundation") },
        { label: "Cheek color", shade: analysis.undertone === "Cool" ? "Pressed Rose" : "Apricot Haze", text: analysis.undertone === "Cool" ? "Rose blush to echo your natural flush" : "Apricot blush for a softly warmed finish", product: findProduct("duet-cheek-palette") },
        { label: "Eye + lip", shade: analysis.shape === "Heart" ? "Soft Bronze" : "Petal Glow", text: analysis.shape === "Heart" ? "Soft bronze definition with a balanced rose lip" : "Warm metallic definition with a petal gloss", product: findProduct(analysis.shape === "Heart" ? "auric-palette" : "petal-balm") },
      ]
    : []

  return (
    <section className="page-shell studio-page virtual-studio">
      <div className="studio-intro"><div><p className="eyebrow">Virtual Studio · Private by design</p><h1 className="section-title">A closer look at what suits you.</h1></div><p className="soft-copy">Live face mapping suggests tones, textures, and placement from your camera feed. Nothing is uploaded or stored.</p></div>
      <div className="studio-workspace">
        <div className="camera-panel">
          <div className="makeup-control studio-cheek-palette"><div className="control-heading"><span>Cheek color</span><strong>{selectedCheekShade.name}</strong></div><div className="shade-swatches" role="group" aria-label="Choose a cheek color">{cheekShades.map((shade) => <button className={`shade-swatch ${selectedCheekShade.name === shade.name ? "selected" : ""}`} style={{ backgroundColor: shade.hex }} type="button" key={shade.name} onClick={() => selectCheekShade(shade)} aria-label={`Select ${shade.name} cheek color`} aria-pressed={selectedCheekShade.name === shade.name} />)}</div></div>
          <div className="camera-frame"><video ref={videoRef} autoPlay muted playsInline aria-label="Live virtual try-on camera" /><canvas ref={overlayRef} className="camera-overlay" />{!analysis && <div className="face-guide"><span>Place your face here</span></div>}{capturedImage && <img className="captured-preview" src={capturedImage} alt="Captured virtual studio look" />}<div className="camera-status"><span className="status-dot" />{status}</div></div>
          <div className="camera-actions"><button className="studio-button studio-button-primary" type="button" onClick={captureLook} disabled={!cameraReady}>Capture look</button><button className="studio-button" type="button" onClick={restartStudio}>Restart camera</button></div>
          {error && <p className="studio-error" role="alert">{error}</p>}
        </div>
        <aside className="recommendation-panel"><div className="panel-heading"><p className="eyebrow">Your edit</p><span>{analysis ? "01 / 01" : "Waiting"}</span></div>{analysis ? <><div className="analysis-summary"><p>Face profile</p><strong>{analysis.shape}</strong><span>{analysis.undertone} undertone detected</span></div><div className="makeup-control"><div className="control-heading"><span>Lip shade</span><strong>{selectedLipShade.name}</strong></div><div className="shade-swatches" role="group" aria-label="Choose a lip shade">{lipShades.map((shade) => <button className={`shade-swatch ${selectedLipShade.name === shade.name ? "selected" : ""}`} style={{ backgroundColor: shade.hex }} type="button" key={shade.name} onClick={() => selectLipShade(shade)} aria-label={`Select ${shade.name} lipstick`} aria-pressed={selectedLipShade.name === shade.name} />)}</div><label className="opacity-control">Opacity <input type="range" min="0" max="1" step="0.01" value={lipOpacity} onChange={(event) => updateOpacity("lipOpacity", event.target.value)} /><output>{Math.round(lipOpacity * 100)}%</output></label></div><div className="makeup-control"><div className="control-heading"><span>Eyeshadow</span><strong>{selectedEyeShade.name}</strong></div><div className="shade-swatches" role="group" aria-label="Choose an eyeshadow shade">{eyeShades.map((shade) => <button className={`shade-swatch ${selectedEyeShade.name === shade.name ? "selected" : ""}`} style={{ backgroundColor: shade.hex }} type="button" key={shade.name} onClick={() => selectEyeShade(shade)} aria-label={`Select ${shade.name} eyeshadow`} aria-pressed={selectedEyeShade.name === shade.name} />)}</div><label className="opacity-control">Opacity <input type="range" min="0" max="1" step="0.01" value={eyeOpacity} onChange={(event) => updateOpacity("eyeOpacity", event.target.value)} /><output>{Math.round(eyeOpacity * 100)}%</output></label></div><div className="makeup-control"><div className="control-heading"><span>Cheek color</span><strong>Soft flush</strong></div><label className="opacity-control">Opacity <input type="range" min="0" max="1" step="0.01" value={cheekOpacity} onChange={(event) => updateOpacity("cheekOpacity", event.target.value)} /><output>{Math.round(cheekOpacity * 100)}%</output></label></div><div className="recommendation-list">{recommendations.map(({ label, shade, text, product }) => <article className="recommendation" key={label}><div><span>{label}</span><h2>{label === "Eye + lip" ? selectedLipShade.name : shade}</h2><p>{product.name} · {text}</p></div><button type="button" aria-label={`Add ${product.name} to bag`} onClick={() => addToCart(product)}>+</button></article>)}</div><p className="studio-note">A considered starting point, not a rule. Light, camera settings, and skincare can shift a shade read.</p></> : <div className="empty-analysis"><div className="scan-mark" /><h2>Your recommendations will appear here.</h2><p>Allow camera access and face the light. We only use the live feed to create this session.</p></div>}</aside>
      </div>
      <canvas ref={captureRef} className="hidden-canvas" />
    </section>
  )
}

import useRouteMetadata from "../hooks/useRouteMetadata"
import { routeDescriptions } from "../data/catalog"

export default function VirtualStudio() {
  useRouteMetadata({
    title: "AURA | Virtual Studio",
    description: routeDescriptions.studio,
  })

  return (
    <section className="page-shell studio-page">
      <p className="eyebrow">Virtual Studio</p>
      <h1 className="section-title">Try on the collection before you commit.</h1>
      <p className="soft-copy">
        Pair your undertone scan with live overlays, then save the shades and
        textures that feel the most like you.
      </p>
    </section>
  )
}

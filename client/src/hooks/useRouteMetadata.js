import { useEffect } from "react"

function ensureMeta(name) {
  let element = document.querySelector(`meta[name="${name}"]`)

  if (!element) {
    element = document.createElement("meta")
    element.setAttribute("name", name)
    document.head.appendChild(element)
  }

  return element
}

export default function useRouteMetadata({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title
    }

    if (description) {
      ensureMeta("description").setAttribute("content", description)
    }
  }, [description, title])
}
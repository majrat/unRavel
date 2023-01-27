import { useEffect } from 'react'
const importScript = (resourceUrl, integrity, crossorigin) => {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = resourceUrl
    script.integrity = integrity
    script.crossOrigin = crossorigin
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [resourceUrl])
}
export default importScript

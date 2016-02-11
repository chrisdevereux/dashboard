interface ResolvedRequest {
  responseText: string
}

declare class XDomainRequest {
  responseText: string
  
  open(method: string, url: string): void
  send(): void
  
  onload: () => void
  onprogress: () => void
  onerror: () => void
  ontimeout: () => void
}

/** Cross-platform CORS-enabled XMLHttp wrapper */
export default function http(method: string, url: string): Promise<XMLHttpRequest> {
  return sendXDomainRequest(method, url) || sendXMLHTTPRequest(method, url)
}

/** For nice browsers */
function sendXMLHTTPRequest(method: string, url: string): Promise<ResolvedRequest> {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()
    
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        if (req.status !== 200) {
          reject(`Connection error: ${req.responseText}`)
            
        } else {
          try {
            resolve(req)
            
          } catch (error) {
            reject(error)
          }
        }
      }
    }
    
    req.open(method, url)
    req.send()
  })
}

/** IE 8 workaround. See: http://mcgivery.com/ie8-and-cors/ */
function sendXDomainRequest(method: string, url: string): Promise<ResolvedRequest> {
  if (typeof XDomainRequest === 'undefined') return null
  
  return new Promise((resolve, reject) => {
    const req = new XDomainRequest()
    
    req.onerror = () => reject(Error('Connection error'))
    req.ontimeout = () => reject(Error('Connection timed out'))
    req.onload = () => resolve(req)
    req.onprogress = () => {}
    
    req.open(method, url)
    setTimeout(() => req.send(), 0)
  })
}

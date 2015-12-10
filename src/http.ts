export default function http(method: string, url: string): Promise<XMLHttpRequest> {
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
    
    req.open('get', url)
    req.send()
  })
}

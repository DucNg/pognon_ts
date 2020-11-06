function escape (str: string) {
    return str.replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
}
  
export function encode (str :string) {
    return escape(Buffer.from(str, 'utf8').toString('base64'))
}
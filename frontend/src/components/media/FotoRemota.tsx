import { useState, type ImgHTMLAttributes } from 'react'

type FotoRemotaProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  /** Foto local que se pone si la remota no carga. Sin respaldo, la imagen se oculta. */
  respaldo?: string
  /** Si se da, la imagen va dentro de un marco con estas clases, que también se oculta. */
  marco?: string
}

/**
 * Imagen que viene de otra web (la galería oficial de RITO). Si esa web no responde o
 * cambia el archivo, se cambia por una foto local o se oculta, en vez de dejar un icono roto.
 */
export function FotoRemota({ src, respaldo, marco, alt, ...props }: FotoRemotaProps) {
  const [fallo, setFallo] = useState(false)
  if (fallo && !respaldo) return null
  const img = (
    <img
      {...props}
      src={fallo && respaldo ? respaldo : src}
      alt={alt}
      onError={() => setFallo(true)}
    />
  )
  return marco ? <div className={marco}>{img}</div> : img
}

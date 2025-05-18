// Interface describing a single file type object
export interface FileTypeInfo {
  ext: string
  mime: string
}

export type FileTypeKey =
  | 'PNG'
  | 'JPG'
  | 'JPEG'
  | 'GIF'
  | 'SVG'
  | 'WEBP'
  | 'BMP'
  | 'TIFF'
  | 'PDF'
  | 'DOC'
  | 'DOCX'
  | 'XLS'
  | 'XLSX'
  | 'PPT'
  | 'PPTX'
  | 'TXT'
  | 'CSV'
  | 'MP3'
  | 'WAV'
  | 'OGG'
  | 'AAC'
  | 'MP4'
  | 'WEBM'
  | 'OGV'
  | 'AVI'
  | 'ZIP'
  | 'RAR'
  | 'TAR'
  | 'GZ'

export type FileType = Record<FileTypeKey, FileTypeInfo>

export const FILE_TYPE: FileType = {
  PNG: { ext: '.png', mime: 'image/png' },
  JPG: { ext: '.jpg', mime: 'image/jpeg' },
  JPEG: { ext: '.jpeg', mime: 'image/jpeg' },
  GIF: { ext: '.gif', mime: 'image/gif' },
  SVG: { ext: '.svg', mime: 'image/svg+xml' },
  WEBP: { ext: '.webp', mime: 'image/webp' },
  BMP: { ext: '.bmp', mime: 'image/bmp' },
  TIFF: { ext: '.tiff', mime: 'image/tiff' },
  PDF: { ext: '.pdf', mime: 'application/pdf' },
  DOC: { ext: '.doc', mime: 'application/msword' },
  DOCX: { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  XLS: { ext: '.xls', mime: 'application/vnd.ms-excel' },
  XLSX: { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  PPT: { ext: '.ppt', mime: 'application/vnd.ms-powerpoint' },
  PPTX: { ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation' },
  TXT: { ext: '.txt', mime: 'text/plain' },
  CSV: { ext: '.csv', mime: 'text/csv' },
  MP3: { ext: '.mp3', mime: 'audio/mpeg' },
  WAV: { ext: '.wav', mime: 'audio/wav' },
  OGG: { ext: '.ogg', mime: 'audio/ogg' },
  AAC: { ext: '.aac', mime: 'audio/aac' },
  MP4: { ext: '.mp4', mime: 'video/mp4' },
  WEBM: { ext: '.webm', mime: 'video/webm' },
  OGV: { ext: '.ogv', mime: 'video/ogg' },
  AVI: { ext: '.avi', mime: 'video/x-msvideo' },
  ZIP: { ext: '.zip', mime: 'application/zip' },
  RAR: { ext: '.rar', mime: 'application/vnd.rar' },
  TAR: { ext: '.tar', mime: 'application/x-tar' },
  GZ: { ext: '.gz', mime: 'application/gzip' },
}

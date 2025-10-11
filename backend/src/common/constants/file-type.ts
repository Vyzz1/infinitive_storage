const thumbnailFileExtensions = [
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
];

export const shouldGenerateThumbnail = (ext: string): boolean => {
  return thumbnailFileExtensions.includes(ext.toLowerCase());
};

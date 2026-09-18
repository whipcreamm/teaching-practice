const THAI_MONTHS_SHORT = [
  'ม.ค.',
  'ก.พ.',
  'มี.ค.',
  'เม.ย.',
  'พ.ค.',
  'มิ.ย.',
  'ก.ค.',
  'ส.ค.',
  'ก.ย.',
  'ต.ค.',
  'พ.ย.',
  'ธ.ค.',
];

const THAI_MONTHS_FULL_MAP: Record<string, string> = {
  'มกราคม': 'ม.ค.',
  'กุมภาพันธ์': 'ก.พ.',
  'มีนาคม': 'มี.ค.',
  'เมษายน': 'เม.ย.',
  'พฤษภาคม': 'พ.ค.',
  'มิถุนายน': 'มิ.ย.',
  'กรกฎาคม': 'ก.ค.',
  'สิงหาคม': 'ส.ค.',
  'กันยายน': 'ก.ย.',
  'ตุลาคม': 'ต.ค.',
  'พฤศจิกายน': 'พ.ย.',
  'ธันวาคม': 'ธ.ค.',
};

/**
 * Format date string into Thai format, e.g. "5 ก.ย. 69"
 * Handles ISO dates (2026-09-05), slash dates (6/5/2568, 6/5/68), Thai text dates, or Date objects
 */
export function formatThaiDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '';

  const clean = dateStr.trim();

  // Pattern 1: YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);

    const thaiYearShort = (year >= 2400 ? year : year + 543) % 100;
    const thaiMonth = THAI_MONTHS_SHORT[month - 1] || '';

    return `${day} ${thaiMonth} ${thaiYearShort}`;
  }

  // Pattern 2: DD/MM/YYYY or DD/MM/YY or DD-MM-YYYY
  const slashMatch = clean.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10);
    const month = parseInt(slashMatch[2], 10);
    let year = parseInt(slashMatch[3], 10);

    let thaiYearShort = year;
    if (year >= 2400) {
      thaiYearShort = year % 100;
    } else if (year >= 100) {
      thaiYearShort = (year + 543) % 100;
    }

    const thaiMonth = THAI_MONTHS_SHORT[month - 1] || '';

    return `${day} ${thaiMonth} ${thaiYearShort}`;
  }

  // Pattern 3: Already in Thai style like "15 มิ.ย. 2569" or "15 มิ.ย. 69" or "6 พฤษภาคม 2568"
  const thaiTextMatch = clean.match(/^(\d{1,2})\s*([^\d\s]+)\s*(\d{2,4})$/);
  if (thaiTextMatch) {
    const day = thaiTextMatch[1];
    let month = thaiTextMatch[2];
    let year = parseInt(thaiTextMatch[3], 10);

    if (THAI_MONTHS_FULL_MAP[month]) {
      month = THAI_MONTHS_FULL_MAP[month];
    }

    if (year >= 2400) {
      year = year % 100;
    } else if (year >= 100) {
      year = (year + 543) % 100;
    }
    return `${day} ${month} ${year}`;
  }

  // Fallback to JS Date parsing
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const day = parsed.getDate();
    const month = parsed.getMonth();
    const thaiYearShort = (parsed.getFullYear() + 543) % 100;
    return `${day} ${THAI_MONTHS_SHORT[month]} ${thaiYearShort}`;
  }

  return dateStr;
}

/**
 * Resize and compress an image file (with automatic HEIC/HEIF conversion) to Base64 JPEG/PNG
 */
export async function compressImageFile(file: File, maxWidth = 900, maxHeight = 900, quality = 0.82): Promise<string> {
  let targetBlob: Blob | File = file;

  // Check if file is HEIC or HEIF
  const isHeic = file.name.toLowerCase().endsWith('.heic') || 
                 file.name.toLowerCase().endsWith('.heif') || 
                 file.type === 'image/heic' || 
                 file.type === 'image/heif';

  if (isHeic) {
    try {
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.85,
      });
      targetBlob = Array.isArray(converted) ? converted[0] : converted;
    } catch (err) {
      console.warn('HEIC conversion failed, falling back to original file:', err);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(targetBlob);
  });
}


/**
 * Format PDF URL for iframe embed (e.g. converting Google Drive view links to /preview)
 */
export function formatPdfEmbedUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();
  
  // Google Drive match patterns:
  // 1. https://drive.google.com/file/d/FILE_ID/view... -> .../preview
  const driveFileMatch = trimmed.match(/^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }

  // 2. https://drive.google.com/open?id=FILE_ID -> https://drive.google.com/file/d/FILE_ID/preview
  const driveIdMatch = trimmed.match(/^https:\/\/drive\.google\.com\/(?:open|uc)\?id=([a-zA-Z0-9_-]+)/);
  if (driveIdMatch) {
    return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
  }

  return trimmed;
}


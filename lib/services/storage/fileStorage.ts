import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Save a file to local storage with security measures
 * @param buffer File buffer
 * @param mimeType MIME type of the file
 * @param originalName Original filename
 * @param maxSize Maximum file size in bytes (default: 50MB)
 * @returns Object with file information
 */
export async function saveFileLocally(
  buffer: Buffer,
  mimeType: string,
  originalName: string,
  maxSize: number = 50 * 1024 * 1024 // 50MB default
) {
  try {
    // Validate file size
    if (buffer.length > maxSize) {
      throw new Error(`File size exceeds ${maxSize / (1024 * 1024)}MB limit`);
    }

    // Generate unique filename
    const fileExt = originalName.split('.').pop() || 'bin';
    const filename = `${uuidv4()}.${fileExt}`;
    const uploadDir = join(process.cwd(), 'public/uploads');
    const filePath = join(uploadDir, filename);
    const publicPath = `/uploads/${filename}`;

    // Ensure upload directory exists
    await mkdir(uploadDir, { recursive: true });

    // Save file to disk
    await writeFile(filePath, buffer);

    return {
      filename,
      originalName,
      mimeType,
      size: buffer.length,
      path: publicPath,
      url: `${process.env.NEXT_PUBLIC_APP_URL || ''}${publicPath}`,
      fullPath: filePath,
    };
  } catch (error) {
    console.error('Error saving file locally:', error);
    throw new Error('Failed to save file');
  }
}

/**
 * Delete a file from local storage
 * @param filePath Full path to the file
 */
export async function deleteFileLocally(filePath: string) {
  try {
    await unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Validate file type against allowed types
 * @param mimeType MIME type of the file
 * @param allowedTypes Array of allowed MIME types
 * @returns Boolean indicating if file type is allowed
 */
export function validateFileType(mimeType: string, allowedTypes: string[]): boolean {
  return allowedTypes.includes(mimeType);
}

/**
 * Validate file size
 * @param size File size in bytes
 * @param maxSize Maximum allowed size in bytes
 * @returns Boolean indicating if file size is within limit
 */
export function validateFileSize(size: number, maxSize: number): boolean {
  return size <= maxSize;
}
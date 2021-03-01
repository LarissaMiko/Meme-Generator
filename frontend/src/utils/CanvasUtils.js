/***
 * This function creates a new Image and wraps a promise around it, which resolves the image once the onload callback returns.
 * @param src The image source
 * @returns {Promise<unknown>}  The Promise wrapped around the Image
 */
export const getImage = (src) => {
  return new Promise((resolve => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.src = src
    img.onload = (() => {resolve(img)})
  }))}

/***
 * This functions wraps the callback of canvas.toBlob() into a Promise so that one can await its return
 * @param canvas  The canvas to convert into a blob
 * @param quality A number between 0 and 1 indicating the image quality
 * @returns {Promise<unknown>}  The Promise wrapped around the blob callback
 */
export const getBlob = (canvas, quality) => {
  return new Promise((resolve => {canvas.toBlob((blob) => {resolve(blob)}, 'image/jpeg', quality)}))
}

/***
 * This functions draws text on a canvas.
 * @param ctx The context of the canvas to draw on
 * @param x The x-Position for drawing
 * @param y The y-Position for drawing
 * @param captionSettings The Settings (caption, font, fontSize, fontColor, fontStyle, fontWeight, fontUppercase) of the text to draw
 * @returns {[number, number]} The width and height of the drawn text
 */
export const drawText = (ctx, x, y, captionSettings) => {
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.font = `${captionSettings.fontStyle} ${captionSettings.fontWeight} ${captionSettings.fontSize}px ${captionSettings.font}`
  ctx.fillStyle = captionSettings.fontColor
  const text = (captionSettings.fontUppercase) ? captionSettings.caption.toUpperCase() : captionSettings.caption
  ctx.fillText(text, x + 5, y + 5)
  return ([ctx.measureText(text).width, Number(captionSettings.fontSize)])
}

/***
 * This function draws lines on a canvas
 * @param ctx The context of the canvas to draw on
 * @param positions A list of positions defining the lines
 * @param color The color of the lines
 * @param size  The size of the lines
 */
export const drawLine = (ctx, positions, color, size) => {
  ctx.strokeStyle = color
  ctx.lineWidth = size
  ctx.lineJoin = "round"

  for (let i = 0; i < positions.length; i++) {
    if (positions[i][0] === -1) {
      ctx.closePath()
    } else {
      if (positions[i - 1][0] === -1) {
        ctx.beginPath()
        ctx.moveTo(positions[i][0], positions[i][1])
        ctx.stroke()
      } else {
        ctx.lineTo(positions[i][0], positions[i][1])
        ctx.stroke()
      }
    }
  }
}
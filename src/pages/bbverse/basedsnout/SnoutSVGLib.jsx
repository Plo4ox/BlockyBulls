class SnoutSVGLib {
  constructor() {
    this.levelStrings = [
      "2211-03211+04221+11311-22322+23311-24311+25311-26311+21411-32431+35421+42511-53511+54521+6",
      "2111-13111+14111-15111+12211-03231+01311-22322+23311-24311+25311-26311+21411-32431+35421+42511-53511+54521+6",
      "2111-13111+14111-15111+12211-03231+01311-22322+23311-24311+25311-26311+21411-32431+35421+42511-53531+53612-64612+6",
      "2111-13111+14111-15111+12211-03231+01311-22322+23311-24311+25311-26311+20411-31421+33411+24411-25411+26421+42511-53531+52612-63612+64612-65612+6",
    ];
  }

  generateSVG(level, address, width, height) {
    const colors = this.deriveColors(address);
    return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 8 8">
        ${this.generateRects(colors, level)}
      </svg>`;
  }

  generateRects(colors, level) {
    const rectString = this.getRectString(level);
    let rects = "";
    for (let i = 0; i < rectString.length; i += 6) {
      rects += this.generateRect(rectString.slice(i, i + 6), colors);
    }
    return rects;
  }

  getRectString(level) {
    if (level < 0 || level > 3) {
      throw new Error("Invalid level");
    }
    return this.levelStrings[level];
  }

  generateRect(rectData, colors) {
    const x = rectData[0];
    const y = rectData[1];
    const width = rectData[2];
    const height = rectData[3];
    const isShaded = rectData[4] === "-";
    const colorIndex = parseInt(rectData[5]); // Adjust for 0-based array

    let color = colors[colorIndex] || "000000"; // Default to black if color is undefined
    if (isShaded) {
      color = this.shadeColor(color);
    }

    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#${color}"/>`;
  }

  shadeColor(color) {
    if (!color || color.length !== 6) {
      return "000000"; // Return black if the color is invalid
    }

    // Convert color to RGB
    const r = parseInt(color.slice(0, 2), 16);
    const g = parseInt(color.slice(2, 4), 16);
    const b = parseInt(color.slice(4, 6), 16);

    // Darken each component
    const newR = Math.floor((r * 2) / 3)
      .toString(16)
      .padStart(2, "0");
    const newG = Math.floor((g * 2) / 3)
      .toString(16)
      .padStart(2, "0");
    const newB = Math.floor((b * 2) / 3)
      .toString(16)
      .padStart(2, "0");

    return newR + newG + newB;
  }

  deriveColors(address) {
    const colors = [];
    for (let i = 0; i < 7; i++) {
      let startIndex = 2 + i * 6; // Skip '0x' prefix
      let colorHex = address.slice(startIndex, startIndex + 6);
      if (i === 6) {
        colorHex = colorHex.slice(0, 4) + "00";
      }
      colors.push(colorHex || this.generateRandomColor()); // Fallback to random color if undefined
    }
    return colors;
  }

  generateRandomColor() {
    return Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  }

  static generateRandomAddress() {
    return (
      "0x" +
      [...Array(40)]
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")
    );
  }

  static generateRandomSnout(level) {
    const lib = new SnoutSVGLib();
    const address = this.generateRandomAddress();
    return { svg: lib.generateSVG(level, address, 256, 256), address: address };
  }
}

export default SnoutSVGLib;

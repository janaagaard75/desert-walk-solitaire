import Jimp from "jimp"
import appSettings from "./app.json"

const inputFileName = "assets-source/splash-screen.png"
const outputFileName = "assets/splash-screen.png"

const main = async () => {
  try {
    const image = await Jimp.read(inputFileName)
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK)
    const version = appSettings.expo.version
    const versionText = `Version ${version}`
    const imageSize = {
      height: 1242,
      width: 1242
    }
    const correction = 100
    const margin = 20
    image
      .print(
        font,
        100,
        100,

        {
          text: versionText,
          alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
          alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM
        },
        imageSize.width - (correction + margin),
        imageSize.height - (correction + margin)
      )
      .write(outputFileName)
  } catch (error) {
    console.error(error)
  }
}

main()

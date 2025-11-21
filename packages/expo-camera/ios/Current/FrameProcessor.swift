import AVFoundation
import SuuqeDMABuf

class FrameProcessor: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    var enableBufferCallback: Bool = false

    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard enableBufferCallback else {
            return
        }

        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            return
        }

        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer {
            CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
        }

        let width = CVPixelBufferGetWidth(pixelBuffer)
        let height = CVPixelBufferGetHeight(pixelBuffer)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
        let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)

        if let baseAddress {
            DMABuf.setBuf(baseAddress, width: Int32(width), height: Int32(height), bytesPerRow: Int32(bytesPerRow))
            DMABuf.emitFrameChangeEvent()
        }
    }
}

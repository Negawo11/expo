import AVFoundation
import SuuqeDMABuf

class FrameProcessor: NSObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    private var frameData: FrameData?
    private var context: UnsafeMutableRawPointer?
    var enableBufferCallback: Bool = false

    func setFrameData(pointer: String) {
        let address = UInt64(pointer) ?? 0
        if address == 0 {
            self.frameData = nil
            self.context = nil
            return
        }
        let pointer = UnsafeMutablePointer<FrameData>(bitPattern: UInt(address))
        self.frameData = pointer?.pointee
        self.context = UnsafeMutableRawPointer(bitPattern: UInt(address))
    }

    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else {
            return
        }

        CVPixelBufferLockBaseAddress(pixelBuffer, .readOnly)
        defer {
            CVPixelBufferUnlockBaseAddress(pixelBuffer, .readOnly)
        }

        let width = CVPixelBufferGetWidth(pixelBuffer)
        let height = CVPixelBufferGetHeight(pixelBuffer)
        let baseAddress = CVPixelBufferGetBaseAddress(pixelBuffer)
        let bytesPerRow = CVPixelBufferGetBytesPerRow(pixelBuffer)
        let dataSize = bytesPerRow * height

        if enableBufferCallback, let baseAddress {
            DMABuf.setBuf(baseAddress, width: Int32(width), height: Int32(height))
            DMABuf.emitFrameChangeEvent()
        }

        guard let frameData = self.frameData, let context = self.context else {
            return
        }

        if var frameDataPointer = UnsafeMutablePointer<FrameData>(bitPattern: UInt(context)) {
            frameDataPointer.pointee.width = width
            frameDataPointer.pointee.height = height
            
            if let bitmapData = frameDataPointer.pointee.bitmapData {
                memcpy(bitmapData, baseAddress, dataSize)
            }
            
            frameData.callback(context, &frameDataPointer.pointee)
        }
    }
}

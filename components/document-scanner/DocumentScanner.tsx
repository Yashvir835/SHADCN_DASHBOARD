import type React from "react"
import { type MutableRefObject, useEffect, useRef, useState } from "react"
import type { DetectedQuadResultItem } from "dynamsoft-document-normalizer"
import {
  CameraEnhancer,
  CaptureVisionRouter,
  CameraView,
  DCEFrame,
  CodeParser,
  EnumBarcodeFormat,
} from "dynamsoft-capture-vision-bundle"
import { intersectionOverUnion } from "./utils"
import { init, mrzTemplate } from "./dcv"

export interface HolderInfo {
  lastName: string
  firstName: string
  birthDate: string
  sex: string
  docNumber: string
}

export interface DocumentScannerProps {
  onScanned?: (blob: Blob, info?: HolderInfo) => void
  onStopped?: () => void
}

const DocumentScanner: React.FC<DocumentScannerProps> = (props: DocumentScannerProps) => {
  const [quadResultItem, setQuadResultItem] = useState<DetectedQuadResultItem | undefined>()
  const [viewBox, setViewBox] = useState("0 0 720 1280")
  const [isScanning, setIsScanning] = useState(false)

  const containerRef: MutableRefObject<HTMLDivElement | null> = useRef(null)
  const routerRef: MutableRefObject<CaptureVisionRouter | null> = useRef(null)
  const dceRef: MutableRefObject<CameraEnhancer | null> = useRef(null)
  const viewRef: MutableRefObject<CameraView | null> = useRef(null)
  const intervalRef = useRef<any>()
  const isSteadyRef = useRef(false)
  const detectingRef = useRef(false)
  const previousResultsRef = useRef<DetectedQuadResultItem[]>([])
  const initializingRef = useRef(false)

  const updateViewBox = async () => {
    const { width, height } = (await dceRef.current?.getResolution()) || { width: 720, height: 1280 }
    setViewBox(`0 0 ${width} ${height}`)
  }

  useEffect(() => {
    const initScanner = async () => {
      if (initializingRef.current) return

      try {
        await init()
        viewRef.current = await CameraView.createInstance()
        dceRef.current = await CameraEnhancer.createInstance(viewRef.current)
        dceRef.current.setResolution({ width: 1920, height: 1080 })
        dceRef.current.on("played", async () => {
          await updateViewBox()
          startScanning()
        })
        routerRef.current = await CaptureVisionRouter.createInstance()

        // Mount the CameraView to the DOM
        if (containerRef.current) {
          viewRef.current.setUIElement(containerRef.current)
        }

        await dceRef.current.open()
      } catch (ex: any) {
        console.error(ex.message || ex)
        alert(ex.message || ex)
      }
    }

    initScanner()
    initializingRef.current = true

    return () => {
      stopScanning()
      routerRef.current?.dispose()
      dceRef.current?.dispose()
    }
  }, [dceRef]) // Added dceRef as a dependency

  const startScanning = () => {
    setIsScanning(true)
    intervalRef.current = setInterval(async () => {
      if (detectingRef.current) return
      detectingRef.current = true
      try {
        const results = await routerRef.current?.capture(dceRef.current?.getFrame())
        if (results && results.detectedQuadResultItems && results.detectedQuadResultItems.length > 0) {
          const result = results.detectedQuadResultItems[0]
          if (
            intersectionOverUnion(
              result.location.points,
              previousResultsRef.current.flatMap((r) => r.location.points),
            ) > 0.8
          ) {
            isSteadyRef.current = true
          } else {
            isSteadyRef.current = false
          }
          previousResultsRef.current = results.detectedQuadResultItems
          if (isSteadyRef.current) {
            stopScanning()
            // TODO: Extract information from document
            console.log("Scanned document:", result)
          }
          setQuadResultItem(result)
        }
      } catch (e) {
        console.error(e)
      } finally {
        detectingRef.current = false
      }
    }, 100)
  }

  const stopScanning = () => {
    clearInterval(intervalRef.current)
    setIsScanning(false)
    isSteadyRef.current = false
    detectingRef.current = false
    previousResultsRef.current = []
  }

  const switchCamera = async () => {
    const cameras = await CameraEnhancer.getAllCameras()
    if (cameras.length > 1) {
      const currentCamera = await dceRef.current?.getSelectedCamera()
      const nextCameraIndex = (cameras.indexOf(currentCamera!) + 1) % cameras.length
      await dceRef.current?.selectCamera(cameras[nextCameraIndex])
      await updateViewBox()
    }
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="dce-video-container" style={{ width: "100%", height: "100%" }}></div>
      <svg
        id="overlay"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        {quadResultItem && (
          <polygon
            points={quadResultItem.location.points.map((p) => `${p.x},${p.y}`).join(" ")}
            style={{ fill: "none", stroke: "red", strokeWidth: 2 }}
          />
        )}
      </svg>
      <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: "10px" }}>
        <button onClick={switchCamera}>Switch Camera</button>
        <button onClick={props.onStopped}>Close</button>
      </div>
    </div>
  )
}

export default DocumentScanner


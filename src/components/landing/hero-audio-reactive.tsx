"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"

interface HeroAudioReactiveProps {
  tagline?: string
  headline?: string
  headlineSecondLine?: string
  subtitle?: string
  creditText?: string
  audioSrc?: string
  dark?: boolean
  demoteHeading?: boolean
}

export function HeroAudioReactive({
  tagline = "Find yourself in the space between sounds",
  headline = "THE BEAUTY OF",
  headlineSecondLine = "NOISE",
  subtitle = "When you learn to see through the invisible, you experience the impossible",
  creditText,
  audioSrc,
  dark = true,
  demoteHeading = false,
}: HeroAudioReactiveProps) {
  const Heading = demoteHeading ? "h2" : "h1"
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const animationRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const beamRef = useRef<BeamState | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(!!audioSrc)
  const [audioProgress, setAudioProgress] = useState(0)

  interface BeamState {
    bassIntensity: number
    midIntensity: number
    trebleIntensity: number
    time: number
    colorState: {
      hue: number
      targetHue: number
      saturation: number
      targetSaturation: number
      lightness: number
      targetLightness: number
    }
    waves: {
      amplitude: number
      frequency: number
      speed: number
      offset: number
      thickness: number
      opacity: number
    }[]
    bassHistory: number[]
    postProcessing: {
      filmGrainIntensity: number
      vignetteIntensity: number
      chromaticAberration: number
      scanlineIntensity: number
    }
    grainFrame: number
    grainData: ImageData | null
  }

  const initAudio = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return

    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.8
      analyserRef.current = analyser

      const source = audioContext.createMediaElementSource(audioRef.current)
      source.connect(analyser)
      analyser.connect(audioContext.destination)
    } catch (error) {
      console.error("Error initializing audio:", error)
    }
  }, [])

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    const beam: BeamState = {
      bassIntensity: 0,
      midIntensity: 0,
      trebleIntensity: 0,
      time: 0,
      colorState: {
        hue: 30,
        targetHue: 30,
        saturation: 80,
        targetSaturation: 80,
        lightness: 50,
        targetLightness: 50,
      },
      waves: [
        { amplitude: 30, frequency: 0.003, speed: 0.02, offset: 0, thickness: 1, opacity: 0.9 },
        { amplitude: 25, frequency: 0.004, speed: 0.015, offset: Math.PI * 0.5, thickness: 0.8, opacity: 0.7 },
        { amplitude: 20, frequency: 0.005, speed: 0.025, offset: Math.PI, thickness: 0.6, opacity: 0.5 },
        { amplitude: 35, frequency: 0.002, speed: 0.01, offset: Math.PI * 1.5, thickness: 1.2, opacity: 0.6 },
      ],
      bassHistory: new Array(20).fill(0),
      postProcessing: {
        filmGrainIntensity: 0.04,
        vignetteIntensity: 0.4,
        chromaticAberration: 0.8,
        scanlineIntensity: 0.02,
      },
      grainFrame: 0,
      grainData: null,
    }
    beamRef.current = beam

    resizeCanvas()

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate)

      ctx.fillStyle = "rgba(0, 0, 0, 0.92)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      if (analyserRef.current && isPlaying) {
        const bufferLength = analyserRef.current.frequencyBinCount
        const dataArray = new Uint8Array(bufferLength)
        analyserRef.current.getByteFrequencyData(dataArray)

        let bassSum = 0
        for (let i = 0; i < 30; i++) bassSum += dataArray[i]
        const bassAmplitude = bassSum / (30 * 255)

        let midSum = 0
        for (let i = 30; i < 200; i++) midSum += dataArray[i]
        const midAmplitude = midSum / (170 * 255)

        let trebleSum = 0
        for (let i = 200; i < 800; i++) trebleSum += dataArray[i]
        const trebleAmplitude = trebleSum / (600 * 255)

        beam.bassHistory.shift()
        beam.bassHistory.push(bassAmplitude)
        const avgBass = beam.bassHistory.reduce((a, b) => a + b) / beam.bassHistory.length

        beam.bassIntensity = avgBass
        beam.midIntensity = midAmplitude
        beam.trebleIntensity = trebleAmplitude

        if (bassAmplitude > midAmplitude && bassAmplitude > trebleAmplitude) {
          beam.colorState.targetHue = bassAmplitude * 30
          beam.colorState.targetSaturation = 80 + bassAmplitude * 20
        } else if (midAmplitude > trebleAmplitude) {
          beam.colorState.targetHue = 40 + midAmplitude * 80
          beam.colorState.targetSaturation = 20 + midAmplitude * 30
        } else {
          beam.colorState.targetHue = 200 + trebleAmplitude * 80
          beam.colorState.targetSaturation = 20 + trebleAmplitude * 40
        }

        beam.postProcessing.filmGrainIntensity = 0.03 + bassAmplitude * 0.2
        beam.postProcessing.chromaticAberration = trebleAmplitude * 0.5
      } else {
        beam.bassIntensity = 0.4 + Math.sin(beam.time * 0.01) * 0.3
        beam.midIntensity = 0.3 + Math.sin(beam.time * 0.015) * 0.2
        beam.trebleIntensity = 0.2 + Math.sin(beam.time * 0.02) * 0.1

        beam.colorState.targetHue = 180 + Math.sin(beam.time * 0.005) * 180
        beam.colorState.targetSaturation = 70 + Math.sin(beam.time * 0.01) * 30
        beam.colorState.targetLightness = 50 + Math.sin(beam.time * 0.008) * 20
      }

      beam.colorState.hue += (beam.colorState.targetHue - beam.colorState.hue) * 0.5
      beam.colorState.saturation += (beam.colorState.targetSaturation - beam.colorState.saturation) * 0.2
      beam.colorState.lightness += (beam.colorState.targetLightness - beam.colorState.lightness) * 0.1

      beam.time++

      const centerY = canvas.height / 2

      // Draw waves
      beam.waves.forEach((wave, waveIndex) => {
        wave.offset += wave.speed * (1 + beam.bassIntensity * 0.8)

        const freqInfluence = waveIndex < 2 ? beam.bassIntensity : beam.midIntensity
        const dynamicAmplitude = wave.amplitude * (1 + freqInfluence * 5)

        const waveHue = beam.colorState.hue + waveIndex * 15
        const waveSaturation = beam.colorState.saturation - waveIndex * 5
        const waveLightness = beam.colorState.lightness + waveIndex * 5

        const gradient = ctx.createLinearGradient(0, centerY - dynamicAmplitude, 0, centerY + dynamicAmplitude)
        const alpha = wave.opacity * (0.5 + beam.bassIntensity * 0.5)

        gradient.addColorStop(0, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness}%, 0)`)
        gradient.addColorStop(0.5, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness + 10}%, ${alpha})`)
        gradient.addColorStop(1, `hsla(${waveHue}, ${waveSaturation}%, ${waveLightness}%, 0)`)

        ctx.beginPath()
        for (let x = -50; x <= canvas.width + 50; x += 2) {
          const y1 = Math.sin(x * wave.frequency + wave.offset) * dynamicAmplitude
          const y2 = Math.sin(x * wave.frequency * 2 + wave.offset * 1.5) * (dynamicAmplitude * 0.3 * beam.midIntensity)
          const y3 = Math.sin(x * wave.frequency * 0.5 + wave.offset * 0.7) * (dynamicAmplitude * 0.5)
          const y = centerY + y1 + y2 + y3

          if (x === -50) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }

        ctx.lineTo(canvas.width + 50, canvas.height)
        ctx.lineTo(-50, canvas.height)
        ctx.closePath()

        ctx.fillStyle = gradient
        ctx.fill()
      })

      // Scanlines
      ctx.strokeStyle = `rgba(0, 0, 0, ${beam.postProcessing.scanlineIntensity})`
      ctx.lineWidth = 1
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width * 0.2,
        canvas.width / 2, canvas.height / 2, canvas.width * 0.9
      )
      vignette.addColorStop(0, "rgba(0, 0, 0, 0)")
      vignette.addColorStop(0.5, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity * 0.3})`)
      vignette.addColorStop(0.8, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity * 0.6})`)
      vignette.addColorStop(1, `rgba(0, 0, 0, ${beam.postProcessing.vignetteIntensity})`)
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Film flicker
      const flicker = Math.sin(beam.time * 0.3) * 0.02 + Math.random() * 0.01
      ctx.fillStyle = `rgba(255, 255, 255, ${flicker})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Color grading
      ctx.save()
      ctx.globalCompositeOperation = "overlay"
      ctx.globalAlpha = 0.1
      const colorGradeGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      colorGradeGradient.addColorStop(0, "rgb(255, 240, 220)")
      colorGradeGradient.addColorStop(0.5, "rgb(255, 255, 255)")
      colorGradeGradient.addColorStop(1, "rgb(220, 230, 255)")
      ctx.fillStyle = colorGradeGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      // Film scratches (occasional)
      if (Math.random() < 0.005) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`
        ctx.lineWidth = Math.random() * 2 + 0.5
        ctx.beginPath()
        const scratchX = Math.random() * canvas.width
        ctx.moveTo(scratchX, 0)
        ctx.lineTo(scratchX + (Math.random() - 0.5) * 20, canvas.height)
        ctx.stroke()
      }
    }

    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const togglePlayback = useCallback(() => {
    if (!audioRef.current) return

    if (!audioContextRef.current) {
      initAudio()
    }

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume()
      }
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error)
      })
    }

    setIsPlaying(!isPlaying)
  }, [isPlaying, initAudio])

  const updateProgress = useCallback(() => {
    if (audioRef.current && audioRef.current.duration) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setAudioProgress(progress)
    }
  }, [])

  useEffect(() => {
    const cleanup = initCanvas()
    return cleanup
  }, [initCanvas])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleCanPlay = () => setIsLoading(false)
      const handleError = () => setIsLoading(false)

      audio.addEventListener("canplay", handleCanPlay)
      audio.addEventListener("error", handleError)
      audio.addEventListener("timeupdate", updateProgress)

      return () => {
        audio.removeEventListener("canplay", handleCanPlay)
        audio.removeEventListener("error", handleError)
        audio.removeEventListener("timeupdate", updateProgress)
      }
    }
  }, [updateProgress])

  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--lp-bg)", color: "var(--lp-fg)" }}
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 size-full"
      />

      {/* Content overlay */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {tagline && (
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] opacity-60 sm:text-sm">
            {tagline}
          </p>
        )}
        <Heading className="text-5xl font-bold leading-[0.95] tracking-[-0.02em] sm:text-7xl md:text-8xl lg:text-9xl">
          <span className="block">{headline}</span>
          {headlineSecondLine && (
            <span className="block">{headlineSecondLine}</span>
          )}
        </Heading>
        {subtitle && (
          <p className="mx-auto mt-8 max-w-md text-sm opacity-50 sm:text-base">
            {subtitle}
          </p>
        )}
        {creditText && (
          <p className="mt-4 text-xs uppercase tracking-[0.15em] opacity-30">
            {creditText}
          </p>
        )}

        {/* Audio controls */}
        {audioSrc && (
          <div className="mt-10 flex flex-col items-center gap-4">
            <button
              onClick={togglePlayback}
              disabled={isLoading}
              className="rounded-full border px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] transition-all duration-300 disabled:opacity-30"
              style={{
                borderColor: "var(--lp-border)",
                backgroundColor: isPlaying ? "var(--lp-muted)" : "transparent",
              }}
            >
              {isLoading ? "Yükleniyor" : isPlaying ? "Durdur" : "Oynat"}
            </button>
            {isPlaying && (
              <div
                className="h-0.5 w-48 overflow-hidden rounded-full"
                style={{ backgroundColor: "var(--lp-muted)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${audioProgress}%`, backgroundColor: "var(--lp-primary)" }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          crossOrigin="anonymous"
          preload="auto"
        />
      )}
    </section>
  )
}

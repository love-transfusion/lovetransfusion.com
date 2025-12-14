/* eslint-disable react-hooks/purity */
'use client'
import type React from 'react'
import { useCallback, useId, useMemo, useRef } from 'react'

type SupportedEvent =
  | React.FormEvent<HTMLFormElement>
  | React.MouseEvent<HTMLElement>
  | SubmitEvent
  | Event
  | React.BaseSyntheticEvent

const DEFAULT_MIN_MS = 3000

const isLikelyRandomToken = (text: string) => {
  const s = text.trim()
  if (s.length < 15) return false
  if (/\s/.test(s)) return false
  if (/https?:\/\//i.test(s)) return false

  // Only letters/numbers (common for bot tokens)
  if (!/^[A-Za-z0-9]+$/.test(s)) return false

  const hasLower = /[a-z]/.test(s)
  const hasUpper = /[A-Z]/.test(s)
  const hasDigit = /\d/.test(s)

  // "Token-y" mix: e.g. HKwStlmOoGghRjN...
  const mixedCase = hasLower && hasUpper

  // Measure character diversity (random strings tend to have many unique chars)
  const uniqueRatio = new Set(s).size / s.length

  // Vowel ratio: random tokens often have low-ish vowel density
  const vowelCount = (s.match(/[aeiou]/gi) ?? []).length
  const vowelRatio = vowelCount / s.length

  // Triggers if it looks token-like
  return (
    (mixedCase && uniqueRatio > 0.55) ||
    (hasDigit && uniqueRatio > 0.55) ||
    (uniqueRatio > 0.7 && vowelRatio < 0.35)
  )
}

export function useBotGuard() {
  const id = useId()
  const tsRef = useRef<number>(Date.now())
  const honeypotName = useMemo(
    () => `hp_${id.replace(/:/g, '').slice(-10)}`,
    [id]
  )

  const tsName = useMemo(() => `ts_${id.replace(/:/g, '').slice(-10)}`, [id])

  const mountedAtRef = useRef<number>(Date.now())

  const getFormEl = useCallback((e?: SupportedEvent) => {
    if (!e) return null

    if ('currentTarget' in e && e.currentTarget instanceof HTMLFormElement) {
      return e.currentTarget
    }

    if ('target' in e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const t = (e as any).target
      if (t instanceof Element) {
        const form = t.closest('form')
        if (form instanceof HTMLFormElement) return form
      }
    }

    return null
  }, [])

  const BotFields = useMemo<React.FC>(() => {
    const Comp: React.FC = () => {
      return (
        <>
          <input
            type="checkbox"
            name={honeypotName}
            tabIndex={-1}
            aria-hidden="true"
            autoComplete="off"
            defaultChecked={false}
            style={{
              position: 'absolute',
              left: '-10000px',
              width: '1px',
              height: '1px',
              overflow: 'hidden',
            }}
          />

          {/* Stable timestamp */}
          <input
            type="hidden"
            name={tsName}
            value={String(tsRef.current)}
            readOnly
          />
        </>
      )
    }
    return Comp
  }, [honeypotName, tsName])

  const isBotFromEvent = useCallback(
    (e?: SupportedEvent): boolean => {
      try {
        // 1) Fast submit (in-memory)
        if (Date.now() - mountedAtRef.current < DEFAULT_MIN_MS) {
          return true
        }

        const formEl = getFormEl(e)
        if (!formEl) return false

        const fd = new FormData(formEl)

        // 2) Honeypot filled
        const hp = fd.get(honeypotName)
        if (hp != null) {
          return true
        }

        // 3) Timestamp-based time-to-submit
        const tsRaw = fd.get(tsName)
        const ts = typeof tsRaw === 'string' ? Number(tsRaw) : NaN
        if (Number.isFinite(ts)) {
          if (Date.now() - ts < DEFAULT_MIN_MS) {
            return true
          }
        }

        // 4) Optional sanity check (only if field exists)
        const msgRaw =
          fd.get('comment') ??
          fd.get('message') ??
          fd.get('content') ??
          fd.get('fullName')

        if (typeof msgRaw === 'string' && isLikelyRandomToken(msgRaw)) {
          return true
        }

        return false
      } catch {
        return false // fail-open
      }
    },
    [getFormEl, honeypotName, tsName]
  )

  return { ClBotFields: BotFields, clIsBotFromEvent: isBotFromEvent }
}

import styles from "../ipod-classic.module.css"

/**
 * The LCD's rounded bar, filled or with a diamond marker. With a `label` it
 * carries an invisible range input for keyboard and screen readers.
 */
export function ProgressBar({
  value,
  max,
  variant = "fill",
  label,
  valueText,
  disabled,
  onFocus,
  onInput,
  onCommit,
  onBlur,
}: {
  value: number
  max: number
  variant?: "fill" | "marker"
  label?: string
  valueText?: string
  disabled?: boolean
  onFocus?: () => void
  onInput?: (value: number) => void
  onCommit?: () => void
  onBlur?: () => void
}) {
  const percent = max > 0 ? Math.min(100, (value * 100) / max) : 0
  return (
    <div className={styles.progressBar}>
      {variant === "marker" ? (
        <div
          className={styles.progressMarker}
          style={{ left: `${percent}%` }}
        />
      ) : (
        <div className={styles.progressFill} style={{ width: `${percent}%` }} />
      )}
      {label && (
        <input
          className={styles.rangeInput}
          type="range"
          min={0}
          max={max}
          value={value}
          disabled={disabled}
          aria-label={label}
          aria-valuetext={valueText}
          onFocus={onFocus}
          onChange={(event) => onInput?.(event.currentTarget.valueAsNumber)}
          onPointerUp={onCommit}
          onKeyUp={onCommit}
          onBlur={onBlur}
        />
      )}
    </div>
  )
}

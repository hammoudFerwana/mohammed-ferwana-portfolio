/**
 * CounterTicker: renders a metric as plain text.
 *
 * The rolling-number animation was removed: it rendered "0" in the server HTML
 * (seen by crawlers, link previews and the first paint) and stayed at "0" for
 * reduced-motion visitors. The real value is now always in the HTML.
 */
export default function CounterTicker({
  value = 0,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const numeric = typeof value === 'number' ? value : parseFloat(value) || 0;

  return (
    <span className={className}>
      {prefix}
      {numeric.toFixed(decimals)}
      {suffix}
    </span>
  );
}

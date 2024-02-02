export default function Spinner(){
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="#eee" stroke="#444" strokeWidth="2" strokeLinecap="round">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
  </circle>
  <circle cx="50" cy="50" r="30" fill="#a4f" stroke="#444" strokeWidth="2" strokeLinecap="round">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="-360 50 50" dur="1s" repeatCount="indefinite" />
  </circle>
</svg>

    )
}

/**
 * ForgeLoader — Industrial molten metal casting animation.
 * 
 * Pure CSS loader showing a ladle pouring molten metal into mold containers
 * on a moving conveyor belt. Containers fill ONE-BY-ONE as they pass under
 * the stationary pour point. Matches the amber/orange LaserFlow aesthetic.
 */
export function ForgeLoader({ message = 'Loading...' }) {
  return (
    <div className="forge-loader-container">
      <div className="forge-loader">
        {/* Ladle (tilted pouring bucket) - stationary */}
        <div className="ladle">
          <div className="ladle-body"></div>
          <div className="ladle-handle"></div>
        </div>

        {/* Molten metal stream */}
        <div className="molten-stream"></div>

        {/* Infinite conveyor belt with moving molds */}
        <div className="conveyor-viewport">
          <div className="molds-belt">
            {/* 6 molds for seamless infinite loop - molds fill sequentially as they pass under ladle */}
            <div className="mold">
              <div className="mold-fill"></div>
            </div>
            <div className="mold">
              <div className="mold-fill"></div>
            </div>
            <div className="mold">
              <div className="mold-fill"></div>
            </div>
            <div className="mold">
              <div className="mold-fill"></div>
            </div>
            <div className="mold">
              <div className="mold-fill"></div>
            </div>
            <div className="mold">
              <div className="mold-fill"></div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

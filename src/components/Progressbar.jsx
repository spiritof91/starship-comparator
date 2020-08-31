import React from 'react'

export default ({ cn, current, compare, value }) => {
    const percent = () => {
        if (!parseFloat(current)) return 0
        if (!parseFloat(compare) || parseFloat(current) > parseFloat(compare) || parseFloat(current) === parseFloat(compare)) return 100
        if (parseFloat(current) < parseFloat(compare)) {
            const result = parseFloat(current) / parseFloat(compare) * 100;
            return result;
        }
    }
    const width = percent();
    return (
        current === 'unknown' || current === 'n/a' ? <span>{current}</span> :
        <div className='progress'>
            <div 
                className={cn}
                role='progressbar'
                aria-valuenow={current}
                aria-valuemin='0'
                aria-valuemax='100'
                style={{width: width < 20 ? width > 0 ? '20%' : '0%' :`${width}%`}}
                >{value ? <span className='consumables'>{value}</span> : current}</div>
        </div>
    )
}
import React from 'react'

export default () => (
    <div className='loader-container'>
        <div className='loader-wrapper'>
            <div className='spinner-grow text-dark m-2' role='status'>
                <span className='sr-only' />
            </div>
            <div className='spinner-grow text-warning m-2' role='status'>
                <span className='sr-only' />
            </div>
            <div className='spinner-grow text-dark m-2' role='status'>
                <span className='sr-only' />
            </div>
        </div>
        <strong>Hold on! We're getting starships data for you.</strong>
    </div>
)
import React from 'react'
import classes from './loading.module.css'
function loading() {
  return (
    <div className='text-4xl'>
      <p className={classes.loading}>
       Fetching data...
</p>
    </div>
  )
}

export default loading

import { Button } from './components/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/Share'

function App() {

  return (
    <>
      <Button variant='secondary' text='Share Brain' startIcon={<ShareIcon/>} onClick={()=>{}}/>
      <Button variant='primary' text='Add Content' startIcon={<PlusIcon/>} onClick={()=>{}}/>
    </>
  )
}

export default App

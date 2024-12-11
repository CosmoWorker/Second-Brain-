import { Button } from './components/Button'
import { Card } from './components/Card'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/Share'

function App() {

  return (
    <>
      <Button variant='secondary' text='Share Brain' startIcon={<ShareIcon/>} onClick={()=>{}}/>
      <Button variant='primary' text='Add Content' startIcon={<PlusIcon/>} onClick={()=>{}}/>

      <Card type='twitter' title='Random Twitter' link='https://x.com/_Hybreed_/status/1863836212336754712'/>
    </>
  )
}

export default App

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { assets, dummyDateTimeData, dummyShowsData } from '../assets/assets'
import Loading from '../components/Loading'
import { ArrowRightIcon, ClockIcon } from 'lucide-react'
import isoTimeFormat from '../lib/isoTimeFormat'
import Blur from '../components/Blur'
import toast from 'react-hot-toast'

const SeatLayout = () => {
  const groupRows = [['A', 'B'], ['C','D'], ['E', 'F'], ['G', 'H'],['I', 'J']];
  const {id, date} = useParams()
  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [show, setShow] = useState(null)
  const navigate = useNavigate()

  const getShow = () => {
    const foundShow = dummyShowsData.find(s => s._id === id)
    if (foundShow) {
      setShow({
        movie: foundShow,
        dateTime: dummyDateTimeData
      })
    }
  }

  const handleSeatClick = (seatId) => {
    if (!selectedTime) {
      return toast('Please select time first')
    }
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5) {  // >=5, check before add
      return toast('You can only select maximum 5 seats')
    }
    setSelectedSeats(prev => 
      prev.includes(seatId) 
        ? prev.filter(seat => seat !== seatId) 
        : [...prev, seatId]
    )
  }

  const renderSeats = (row, count = 9) => (
    <div key={row} className='flex gap-2 mt-2'>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        {Array.from({ length: count}, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button 
              key={seatId} 
              onClick={() => handleSeatClick(seatId)} 
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer transition-all 
                         ${selectedSeats.includes(seatId) ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/20'}`}
            >
              {seatId}
            </button>
          )
        })}
      </div>
    </div>
  )

  useEffect(() => {
    getShow()
  }, [id])  // Add id dependency

  if (!show) return <Loading />

  const canProceed = selectedTime && selectedSeats.length > 0

  return (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Available Timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime[date]?.map((item) => (
            <div 
              key={item.time} 
              onClick={() => setSelectedTime(item)} 
              className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition 
                         ${selectedTime?.time === item.time ? 'bg-primary text-white' : 'hover:bg-primary/20'}`}
            >
              <ClockIcon className='w-4 h-4' />
              <p className='text-sm'>{isoTimeFormat(item.time)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seat layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <Blur top='-100px' left='-100px' />
        <Blur bottom='0' left='-100px' />
        <h1 className='text-2xl font-semibold mb-4'>Select your seat</h1>
        <img src={assets.screenImage} alt='screen' className='w-full max-w-2xl mx-auto' />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300 w-full max-w-4xl'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11 w-full'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx} className='flex flex-col gap-4'>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>
        <button onClick={()=> navigate('/my-bookings')}
          className='mt-12 px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-all 
              bg-primary text-white hover:bg-primary/90 shadow-lg' 
          
            
        
        >
          Proceed to Checkout <ArrowRightIcon className='w-5 h-5' />
        </button>
        {selectedSeats.length > 0 && (
          <p className='mt-2 text-sm text-primary'>Selected: {selectedSeats.join(', ')} ({selectedSeats.length}/5)</p>
        )}
      </div>
    </div>
  )
}

export default SeatLayout
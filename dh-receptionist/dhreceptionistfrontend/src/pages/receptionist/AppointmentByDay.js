import React, { useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import Sider from '../../components/receptionist/Sider'
import Header from '../../components/receptionist/Header'
import { Link, json } from 'react-router-dom'
import HeaderApp from '../../components/receptionist/Appointment/AppNavbar/HeaderApp'

import { Calendar, momentLocalizer } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from 'moment'
import EditPopup from '../../components/receptionist/Appointment/EditPopup'
import Popup from '../../components/receptionist/Appointment/Popup'
import ModifyPopup from '../../components/receptionist/Appointment/ModifyPopup'
import DeletePopup from '../../components/receptionist/Appointment/DeletePopup'

const localizer = momentLocalizer(moment);


    

function AppointmentByDay() {

  const clickRef = useRef(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showModifyPopup, setShowModifyPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [showAddPopup, setShowAddPopup] = useState(false);

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0);

  useEffect(() => {
    /**
     * What Is This?
     * This is to prevent a memory leak, in the off chance that you
     * teardown your interface prior to the timed method being called.
     */
    return () => {
      window.clearTimeout(clickRef?.current)
    }
  }, [])

  const events = [{
    start: new Date(),
    end : new Date(),
    title : "Appointment Mohit"
  },
    {start: new Date(),
    end : new Date(),
    title : "Appointment Dev"
  },
  {
    start: new Date(),
    end : new Date(),
    title : "Appointment Mohit"
  },
    {start: new Date(),
    end : new Date(),
    title : "Appointment Dev"
  }
]


const handleEventSelect = event => {
  // Set the selected event and open the modal
  
  alert("hello")
};

const onSelectEvent = useCallback((calEvent) => {
  /**
   * Here we are waiting 250 milliseconds (use what you want) prior to firing
   * our method. Why? Because both 'click' and 'doubleClick'
   * would fire, in the event of a 'doubleClick'. By doing
   * this, the 'click' handler is overridden by the 'doubleClick'
   * action.
   */

  window.clearTimeout(clickRef?.current)
  clickRef.current = window.setTimeout(() => {
    // window.alert(`Selected event: ${calEvent.title}`);
    setSelectedSlot(calEvent);
      setShowModifyPopup(true);
  }, 250)
}, [])

const onSelectSlot = useCallback((slotInfo) => {
  /**
   * Here we are waiting 250 milliseconds (use what you want) prior to firing
   * our method. Why? Because both 'click' and 'doubleClick'
   * would fire, in the event of a 'doubleClick'. By doing
   * this, the 'click' handler is overridden by the 'doubleClick'
   * action.
   */
  window.clearTimeout(clickRef?.current)
  clickRef.current = window.setTimeout(() => {
    setSelectedSlot(slotInfo);
      setShowAddPopup(true);
  }, 250)
  
}, [])


  return (
    <Wrapper>
      
      <div className="row flex-nowrap">
   
   <div className="col-lg-11">
    <div className="row">
      <div className="col-lg-10">
         {/* <HeaderApp/> */}

         <Calendar
         localizer={localizer}
         events={events}
         defaultView='day'
         onSelectEvent={onSelectEvent}
         onSelectSlot={onSelectSlot} 
         selectable
         step={15} // Set the step to 15 minutes for each time slot
  // timeslots={4}
   // Set the number of time slots per hour to 4 (60 minutes / 15 minutes = 4)

          min={startOfDay}
          max={endOfDay}
        
         />

      </div>
  
   
            
         
          </div>
   </div>
   </div>
   {showModifyPopup && (
        <ModifyPopup onEdit={() => {
          setShowModifyPopup(false)
          setShowEditPopup(true)
          }
          
        }
        onDelete={() => {
          setShowModifyPopup(false)
          setShowDeletePopup(true)
          }
          
        }
        onClose={() => {
          setShowModifyPopup(false)
          
          }
          
        }
        
        slotInfo={selectedSlot} />
      )}
   {showAddPopup && (
        <Popup onClose={() => setShowAddPopup(false)} slotInfo={selectedSlot} />
      )}

{showEditPopup && (
        <EditPopup onClose={() => setShowEditPopup(false)} slotInfo={selectedSlot} />
      )}
{showDeletePopup && (
        <DeletePopup onClose={() => setShowDeletePopup(false)} slotInfo={selectedSlot} />
      )}



   
    </Wrapper>
  )
}

export default AppointmentByDay
const Wrapper = styled.div `
 #card1 { 
    background-image: linear-gradient(#9dc5f8, #cbfdd9);
    width: 15rem;
    height: 19rem;             
    margin-top: 1rem ;
    @media screen and (max-width: 768px) {
        width: 84%;
        margin-top:12px;
        margin-left: 1.3rem;

    }
    @media screen and (min-width: 768px) and (max-width: 1020px) {
      width: 41rem;           
    }
    @media screen and (min-width: 1020px) and (max-width: 1600px) {
    width: 13rem;
  }
  }
  .dotrem1 {
    list-style-type: none;
    width: 25px;
    padding-left:4px;
  }
    .dotrem {
    list-style-type: none;
  }
  .data{
  
  color: black;
   

 
}
  .download{
    @media screen and (max-width: 768px) {
      width: 84%;
    margin-left: 1.3rem;

    }
  }
  #tableres{
    @media screen and (max-width: 768px) {
      width: 30%;
   
    }
  }
  #sider{
    @media screen and (max-width: 768px) {
      height: 83rem;
   
    }
  }
`




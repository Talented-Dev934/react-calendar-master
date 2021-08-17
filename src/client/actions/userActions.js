import { batch } from 'react-redux';
import { userApi } from '../utils/axios';
import _ from 'lodash';

export const onSelectSlot = (event => {
  return (dispatch) => {
    batch(() => {
      dispatch(updateSelectedSlot(event))
      dispatch(updateSelectedEvent({}))
    })
  }
})

export const onSelectEvent = (event => {
  return (dispatch) => {
    batch(() => {
      dispatch(updateSelectedEvent(event))
      dispatch(updateSelectedSlot({}))
    })
  }
})

export const updateSelectedSlot = (event) => {
  let payload = event;

  // Convert dates to strings
  if (!_.isEmpty(payload)) {
    payload.start = payload.start.toISOString();
    payload.end = payload.end.toISOString();
    payload.slots = payload.slots.map(slot => {
      return slot.toISOString();
    });
  }

  return {
    type: 'UPDATE_SELECTED_SLOT',
    payload
  }
}

export const updateSelectedEvent = (event) => {
  return {
    type: 'UPDATE_SELECTED_EVENT',
    payload: event
  }
}

export const retrieveEvents = () => async (dispatch) => {
  try {
    const res = await userApi.get('/event')

    return Promise.resolve(res.data).then(res => {
      dispatch({
        type: 'RETRIEVE_EVENTS',
        payload: res.data
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const createEvent = (data) => async (dispatch) => {
  try {
    const res = await userApi.post('/event', data)

    return Promise.resolve(res.data).then(res => {
      batch(() => {
        dispatch({
          type: 'CREATE_EVENT',
          payload: res.data
        });
        dispatch({
          type: 'UPDATE_SELECTED_EVENT',
          payload: res.data
        });
        dispatch({
          type: 'UPDATE_SELECTED_SLOT',
          payload: {}
        });
      })
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    const res = await userApi.delete(`/event/${eventId}/delete`)

    // reset slot to current date
    let start = new Date();
    let end = new Date();
    start.setHours(start.getHours() + 1, 0, 0, 0);
    end.setHours(end.getHours() + 2, 0, 0, 0);

    const newSlot = {
      action: 'click',
      start: start.toISOString(),
      end: end.toISOString()
    }

    return Promise.resolve(res.data).then(res => {
      batch(() => {
        dispatch({
          type: 'DELETE_EVENT',
          payload: res.data._id
        });
        dispatch({
          type: 'UPDATE_SELECTED_EVENT',
          payload: {}
        });
        dispatch({
          type: 'UPDATE_SELECTED_SLOT',
          payload: newSlot
        });
      })
    });
  } catch (err) {
    return Promise.reject(err);
  }
};

export const updateEvent = (event) => async (dispatch) => {
  try {
    const res = await userApi.post(`/event/${event.id}/update`, event)

    return Promise.resolve(res.data).then(res => {
      batch(() => {
        dispatch({
          type: 'UPDATE_EVENT',
          payload: res.data
        });
        dispatch({
          type: 'UPDATE_SELECTED_EVENT',
          payload: res.data
        });
      })
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

export const updateUsername = (data) => async (dispatch) => {
  try {
    const res = await userApi.post(`/user/${data._id}/username/update`, data)

    return Promise.resolve(res.data).then(res => {
      dispatch({
        type: 'UPDATE_USERNAME',
        payload: res.username
      });
    });
  } catch (err) {
    return Promise.reject(err);
  }
}

// NOT AN ACTION
export const updatePassword = (data) => async () => {
  try {
    const res = await userApi.post(`/user/${data._id}/password/update`, data)

    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject(err);
  }
}
// import * as actions from '@common/actionTypes';

const initialState = {
};

export default function (state = initialState, action) {
    const {error, meta = {}, type} = action;
    const {sequence = {}} = meta;
    if (sequence.type === 'start' || error) {
        return state;
    }
    switch (type) {
      default:
        return state;
    }
}


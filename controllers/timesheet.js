const Timesheet = require('../models/Timesheet');
const moment = require('moment');

/**
 * GET /get-all-timesheets-month/:year-month
 */
exports.getAllTimesheetsByMonth = function(req, res) {
  let user = req.user.id;
  let period = req.params.period;
  let startDate = moment(period).startOf('month').format('YYYY-MM-DD HH:mm:ss');
  let endDate = moment(period).endOf('month').format('YYYY-MM-DD HH:mm:ss');

  Timesheet.getAllTimesheetsByMonth(user, startDate, endDate)
    .then(function(timesheets) {
      res.json(timesheets);
    }).catch(function(err) {
      console.error(err);
    });
};

/**
 * POST & PUT /timesheets/new
 */
exports.saveTimesheet = function(req, res) {
  let errors = null;
  let timeIsValid = false;
  let breakIsValid = false;
  let timesheet = null;
  let totalHours = 0;
  let totalAmount = 0;

  let checkRecord = new Timesheet({id: req.params.id});

  if(!checkRecord.isNew()) {
    let timesheetStatus = '';

    if (req.body.timesheetStatus === 'W') {
      timesheetStatus = 'P';
    } else {
      timesheetStatus = 'W';
    }

    timesheet = new Timesheet();
    timesheet.save({
      id: req.params.id,
      timesheetStatus: timesheetStatus,
      }, { patch: true })
      .then(function(model) {
        res.send({ timesheet: model, msg: 'Timesheet status has been updated.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });

      return;

  } else {
    let punchIn = moment(req.body.timesheetTimeIn);
    let punchOut = moment(req.body.timesheetTimeOut);
    let workedHours = moment.duration(punchOut.diff(punchIn)).asSeconds();
    let breakDuration = moment.duration(req.body.timesheetTimeBreak).asSeconds();

    req.assert('timesheetEmployer', 'Employer cannot be blank').notEmpty();
    req.assert('timesheetTimeIn', 'Punch In cannot be blank').notEmpty();
    req.assert('timesheetTimeOut', 'Punch Out cannot be blank').notEmpty();

    errors = req.validationErrors();

    if (errors) {
      return res.status(400).send(errors);
    }

    timeIsValid = checkTimeIsValid();
    if (!timeIsValid) {
      res.status(400).send({msg: 'Incorrect Time format!'});
      return;
    };

    if (req.body.timesheetTimeIn >= req.body.timesheetTimeOut) {
      res.json({msg: `Punch Out ${moment(req.body.timesheetTimeOut).format('hh:mm a')} must be higher than Punch In ${moment(req.body.timesheetTimeIn).format('hh:mm a')}
      for the period, please check!`});
      return;
    }

    breakIsValid = checkBreakIsValid(workedHours, breakDuration);
    if (!breakIsValid) {
      res.status(400).send({msg: 'Break must be smaller than duration of work!'});
      return;
    }

    totalHours = setTotalHours(workedHours, breakDuration);
    totalAmount = roundToTwo(totalHours, req.body.timesheetHourly);

    timesheet = new Timesheet();
    timesheet.save({
      timesheetInsertedBy: req.user.id,
      timesheetEmployer: req.body.timesheetEmployer,
      timesheetStartDate: req.body.timesheetTimeIn,
      timesheetEndDate: req.body.timesheetTimeOut,
      timesheetTimeIn: moment(req.body.timesheetTimeIn).format('HH:mm:ss'),
      timesheetTimeOut: moment(req.body.timesheetTimeOut).format('HH:mm:ss'),
      timesheetTimeBreak: req.body.timesheetTimeBreak,
      timesheetHourly: req.body.timesheetHourly,
      timesheetTotal: totalAmount,
      timesheetTotalHours: moment.utc(totalHours * 1000).format('HH:mm:ss'),
      timesheetStatus: 'W',
      timesheetFlag: 'r',
      timesheetAddress: req.body.timesheetAddress,
      timesheetLatitude: req.body.latitude,
      timesheetLongitude: req.body.longitude
    })
    .then(function(model) {
      res.send({ bank: model, msg: 'Timesheet has been added!' });
    })
    .catch(function(err) {
      return res.status(400).send({ msg: err });
    });
  }

  function checkTimeIsValid() {
    let punchIn = moment(req.body.timesheetTimeIn).format('hh:mm:ss');
    let punchOut = moment(req.body.timesheetTimeOut).format('hh:mm:ss');
    let timeBreak = true;

    if (req.body.timesheetTimeBreak) {
      timeBreak = moment(req.body.timesheetTimeBreak, 'hh:mm').isValid();
    }
    if (punchIn && punchOut && timeBreak) {
      return true;
    }

    return false;
  }

  function checkBreakIsValid(workedHours, breakDuration) {
    if (breakDuration >= workedHours) {
      return false;
    }

    return true;
  }

  function setTotalHours(workedHours, breakDuration) {
    let totalHours = workedHours - breakDuration;

    return totalHours;
  }

  function roundToTwo(hours, value) {
    let total = (hours * value) / 3600 /* Convert to seconds*/;

    return +(Math.round(total + "e+2") + "e-2");
  }
}

/**
 * PUT /timesheets/remove-timesheet=id
 */
exports.removeTimesheet = function(req, res) {
  let timesheet = null;
  let checkRecord = new Timesheet({id: req.params.id});

  if(!checkRecord.isNew()) {

    timesheet = new Timesheet();
    timesheet.save({
      id: req.params.id,
      timesheetFlag: 'd',
      }, { patch: true })
      .then(function(model) {
        res.send({ timesheet: model, msg: 'Timesheet status has been removed.' });
      })
      .catch(function(err) {
        res.send({ msg: err });
      });
  }
}

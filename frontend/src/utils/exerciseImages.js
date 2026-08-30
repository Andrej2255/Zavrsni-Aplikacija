// Real demonstration photos for the seeded catalogue exercises.
// Source: free-exercise-db (yuhonas/free-exercise-db), public domain.
import barbellRow from '@/assets/img/ex/barbell-row.jpg'
import benchPress from '@/assets/img/ex/bench-press.jpg'
import bicepCurl from '@/assets/img/ex/bicep-curl.jpg'
import crunch from '@/assets/img/ex/crunch.jpg'
import deadlift from '@/assets/img/ex/deadlift.jpg'
import facePull from '@/assets/img/ex/face-pull.jpg'
import hammerCurl from '@/assets/img/ex/hammer-curl.jpg'
import hangingLegRaise from '@/assets/img/ex/hanging-leg-raise.jpg'
import hipThrust from '@/assets/img/ex/hip-thrust.jpg'
import inclineDbPress from '@/assets/img/ex/incline-db-press.jpg'
import latPulldown from '@/assets/img/ex/lat-pulldown.jpg'
import lateralRaise from '@/assets/img/ex/lateral-raise.jpg'
import legPress from '@/assets/img/ex/leg-press.jpg'
import lunges from '@/assets/img/ex/lunges.jpg'
import overheadPress from '@/assets/img/ex/overhead-press.jpg'
import plank from '@/assets/img/ex/plank.jpg'
import pullUp from '@/assets/img/ex/pull-up.jpg'
import pushUp from '@/assets/img/ex/push-up.jpg'
import squat from '@/assets/img/ex/squat.jpg'
import tricepPushdown from '@/assets/img/ex/tricep-pushdown.jpg'

const MAP = {
  'Bench Press': benchPress,
  'Incline Dumbbell Press': inclineDbPress,
  'Push Up': pushUp,
  'Squat': squat,
  'Leg Press': legPress,
  'Lunges': lunges,
  'Deadlift': deadlift,
  'Pull Up': pullUp,
  'Barbell Row': barbellRow,
  'Lat Pulldown': latPulldown,
  'Overhead Press': overheadPress,
  'Lateral Raise': lateralRaise,
  'Face Pull': facePull,
  'Bicep Curl': bicepCurl,
  'Tricep Pushdown': tricepPushdown,
  'Hammer Curl': hammerCurl,
  'Plank': plank,
  'Crunch': crunch,
  'Hanging Leg Raise': hangingLegRaise,
  'Hip Thrust': hipThrust,
}

export function exerciseImage (name) {
  return MAP[name] || null
}

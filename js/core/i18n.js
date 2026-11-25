import { locText } from './region.js';
// Interface + prompt strings (English). The t() lookup keeps the door open for other languages later.
const D = {
en: {
  'app.name': 'Pip Maths',
  'ui.start': 'Start', 'ui.next': 'Next', 'ui.back': 'Back', 'ui.close': 'Close', 'ui.hint': 'Hint', 'ui.check': 'Check', 'ui.ok': 'OK',
  'ui.done': 'Done', 'ui.again': 'Play again', 'ui.home': 'Home', 'ui.continue': 'Continue', 'ui.settings': 'Settings',
  'ui.grownups': 'Grown-ups', 'ui.holdHint': 'Grown-ups: press and hold for 2 seconds', 'ui.language': 'Language',
  'ui.mode': 'Mode', 'ui.sound': 'Sound effects', 'ui.voice': 'Spoken prompts', 'ui.addLearner': 'Add a learner', 'ui.switch': 'Switch',
  'ui.reset': 'Reset progress', 'ui.resetConfirm': 'Tap again to reset', 'ui.delete': 'Remove learner', 'ui.deleteConfirm': 'Tap again to remove',
  'ui.upNext': 'Up next', 'ui.listen': 'Hear it again', 'ui.skip': 'Skip', 'ui.coins': 'coins', 'ui.stickers': 'stickers', 'ui.all': 'All',
  'ui.sampleNote': 'Sample lessons for this age group. The full set arrives in the next build steps.',
  'track.life': 'Everyday & money', 'track.uni': 'University', 'track.school': 'School maths', 'track.tables': 'Tables', 'track.tricks': 'Tricks', 'track.logic': 'Logic & coding', 'track.vedic': 'Vedic maths', 'track.exam': 'Exam prep', 'track.method': 'Other methods',
  'mode.little': 'Little Learners', 'mode.explore': 'Explorers', 'mode.achieve': 'Achievers', 'mode.adult': 'Adults', 'mode.auto': 'Auto (from age)',
  'status.new': 'New', 'status.learning': 'Learning', 'status.mastered': 'Mastered', 'status.review': 'Review due',
  'ob.lang': 'Choose a language', 'ob.who': 'Who is learning?', 'ob.name': 'Name', 'ob.namePh': 'Type a name', 'ob.age': 'Age', 'ob.adult': 'Adult',
  'ob.go': "Let's go!", 'ob.hello': 'Hi {name}!',
  'fb.great': 'Great!', 'fb.correct': 'Correct!', 'fb.try': 'Not quite. Try again.', 'fb.hint': "Here's a hint.", 'fb.solution': "Here's how to solve it", 'fb.gotit': 'Got it', 'fb.wellDone': 'Well done!',
  'res.score': '{c} of {n} right', 'res.coins': '+{n} coins', 'res.sticker': 'New sticker!', 'res.mastery': 'Mastery {p}%', 'res.best': 'Best: {n}', 'res.newBest': 'New personal best!',
  'g.title': 'Grown-ups', 'g.learners': 'Learners', 'g.progress': 'Progress', 'g.skill': 'Lesson', 'g.status': 'Status', 'g.note': 'Progress is saved on this device only.',
  'q.tapCount': 'Tap {n} {thing}.', 'q.howMany': 'How many {thing}?', 'q.findShape': 'Put the {shape} in its home.', 'q.balance': 'Make both sides the same.',
  'q.abacus': 'Show {n} on the abacus.', 'q.clock': 'Show {time} on the clock.', 'q.numline': 'Put {n} on the number line.',
  'q.solve': 'Solve for x.', 'q.simplify': 'Simplify.', 'q.plot': 'Plot {eq}. Tap two points on the line.', 'q.next': 'What comes next?', 'q.bigger': 'Which is bigger?', 'q.equal': 'They are equal',
  'q.calc': 'Work it out.', 'q.bar': '{name} has {w} stickers. {a} are red and the rest are blue. How many are blue?',
  'q.bar2': '{name} has {a} marbles. {name2} has {b} more. How many does {name2} have?',
  'h.countSlow': 'Count each one slowly as you tap.', 'h.shapeLook': 'Look at the outline. Count its corners.', 'h.balance': 'Count the blocks on the full side.',
  'h.abacus': 'Top bead = 5. Each bottom bead = 1. Tens rod is on the left.', 'h.clock': 'The short hand points to the hour.', 'h.numline': 'Count the steps from 0.',
  'h.carry': 'Add the ones first. If you get 10 or more, carry 1 to the tens.', 'h.series': 'Look at how much it changes each time.',
  'h.fraction': 'Compare the shaded parts of the strips.', 'h.bar': 'Whole minus the known part gives the missing part.', 'h.eq': 'Do the same thing to both sides.',
  'h.like': 'Add the numbers in front of x.', 'h.plot': 'Start at the y-intercept: where x = 0.',
  'thing.apples': 'apples', 'thing.stars': 'stars', 'thing.balloons': 'balloons',
  'shape.circle': 'circle', 'shape.square': 'square', 'shape.triangle': 'triangle', 'shape.star': 'star', 'shape.rectangle': 'rectangle', 'shape.heart': 'heart',
  'time.oclock': "{h} o'clock", 'time.half': 'half past {h}',
  'drill.go': 'Go!', 'drill.left': '{s}s', 'drill.answered': '{n} correct',
  'mock.submit': 'Submit test', 'mock.mark': 'Mark for review', 'mock.flag': 'Flag', 'mock.prev': 'Previous', 'mock.next': 'Next', 'mock.confirm': 'Submit now? {n} unanswered.',
  'mock.yes': 'Submit', 'mock.no': 'Keep going', 'mock.result': 'Your score', 'mock.marks': '{m} of {t} marks', 'mock.section': 'Section', 'mock.marksH': 'Marks', 'rep.open': 'Weekly report', 'rep.title': 'Weekly report', 'rep.subject': 'LearnNest weekly report, {range}', 'rep.email': 'Email me this report', 'rep.copy': 'Copy', 'rep.copied': 'Report copied.', 'rep.copyFail': 'Could not copy on this device.', 'rep.emailNote': 'Opens your email app with the report ready to send to {email}. Tap Send.', 'rep.emailNoAcct': 'Opens your email app with the report ready. Add your email address and tap Send. With a family account it is filled in for you.', 'rep.days': 'days practised', 'rep.questions': 'questions', 'rep.right': 'right first time', 'rep.more': '{n} more than last week', 'rep.fewer': '{n} fewer than last week', 'rep.practised': 'Practised this week', 'rep.mastered': 'Mastered this week', 'rep.help': 'Needs some help', 'rep.none': 'No practice this week. A few minutes on 3 or 4 days makes a big difference.', 'rep.due': '{n} mastered lesson due for a quick review.', 'rep.dueN': '{n} mastered lessons due for a quick review.', 'rep.next': 'Up next:', 'rep.home': 'Try at home (5 minutes)', 'mock.right': '{r} of {n} questions right', 'mock.weak': 'Topics to practise', 'mock.missed': '{n} missed', 'mock.practise': 'Practise', 'mock.review': 'Check your answers', 'mock.blank': 'Not answered', 'mock.yours': 'You chose', 'mock.correct': 'Correct:', 'mock.working': 'Working', 'mock.leave': 'Leave the test? Your answers will be lost.', 'mock.leaveYes': 'Leave', 'mock.blankRule': 'Unanswered questions score marks as in the real contest (see the note).',
  'mock.note': 'Sample mock: original questions in the exam’s four-section pattern. Real-length mocks come with the Exam Centre build.',
  'ex.start': 'Start practice',
  'pick.peek': 'Look again', 'tab.hear': 'Hear it', 'ob.country': 'Where do you live?', 'ui.devcheck': 'Device check', 'lvl.yours': 'Your level', 'tg.tap': 'Tap a point on the grid', 'ui.learn': 'Learn', 'prog.title': "{name}'s progress", 'prog.notyet': 'not started yet', 'prog.score': 'Score', 'prog.empty': 'No lessons finished yet. Play a lesson and your progress shows up here!',
  'own.as': 'Signed in as {email}.', 'own.err': 'The server could not check: ', 'own.title': 'Admin (owner only)', 'own.signin': 'The admin page is only for the app owner. Sign in with the owner account to open it.', 'own.notadmin': 'This account is not the owner account, so the admin page stays closed.',
  'acc.title': 'Family account', 'acc.why': 'Optional. Back up progress and use the same learners on every device (tablet, phone, computer).',
  'acc.create': 'Create account', 'acc.signin': 'Sign in', 'acc.forgot': 'Reset password', 'acc.newpw': 'New password', 'acc.show': 'Show', 'acc.hide': 'Hide', 'acc.pwTip': 'At least 8 characters. Your browser can suggest a strong password and remember it for you.', 'acc.email': 'Parent email', 'acc.password': 'Password (8+ characters)',
  'acc.intro.signup': 'For parents and guardians. Children do not need an email: they stay as learners under your account.', 'acc.intro.signin': 'Sign in with your family account.',
  'acc.intro.forgot': 'We will email you a link to choose a new password.', 'acc.intro.newpw': 'Choose a new password for your family account.',
  'acc.consent': 'I am the parent or guardian, and I agree to the <a href="privacy.html" target="_blank">privacy policy</a>.', 'acc.needConsent': 'Please tick the box to confirm you are the parent or guardian.',
  'acc.badEmail': 'Please enter a valid email.', 'acc.shortPw': 'The password needs at least 8 characters.', 'acc.wait': 'Please wait…',
  'acc.checkEmail': 'Nearly done! We sent a link to <b>{email}</b>. Open it on this device to finish signing up.', 'acc.resetSent': 'If <b>{email}</b> has an account, a reset link is on its way.',
  'acc.welcome': 'Signed in. Progress now saves to your family account.', 'acc.pwSaved': 'New password saved.', 'acc.confirmed': 'Email confirmed: you are signed in.',
  'acc.forgotQ': 'Forgot password?', 'acc.noAccount': 'Create an account', 'acc.haveAccount': 'I already have an account', 'acc.haveFamily': 'I have a family account: sign in',
  'acc.noLearnersYet': 'No learners in this account yet: add one now.',
  'acc.as': 'Signed in as <b>{email}</b>', 'acc.syncing': 'Saving…', 'acc.offline': 'Offline: changes will save when you are back online.', 'acc.savedAt': 'All saved at {time}', 'acc.auto': 'Progress saves automatically.',
  'acc.syncNow': 'Sync now', 'acc.synced': 'Everything is up to date.', 'acc.signout': 'Sign out', 'acc.signedOut': 'Signed out. This family\'s learners were removed from this device. Sign in to get them back.', 'acc.signoutAnyway': 'Sign out anyway (unsaved progress will be lost)', 'acc.notBackedUp': 'Could not back up just now. Check the internet connection, or tap again to sign out anyway.', 'acc.privacy': 'Privacy',
  'acc.delete': 'Delete account', 'acc.deleteConfirm': 'Tap again: delete the account and all saved progress', 'acc.deleted': 'Account deleted. Learners stay on this device only.',
  'adm.families': 'All families', 'adm.f.families': 'families', 'adm.f.learners': 'learners', 'adm.f.active7': 'active this week', 'adm.f.new30': 'new families (30 days)',
  'adm.f.country': 'Countries:', 'adm.f.mode': 'Age groups:', 'adm.f.top': 'Most practised lessons', 'ui.country': 'Country', 'ui.countrySet': 'Country set to {c}. Numbers and money now follow it.', 'ui.logout': 'Switch learner', 'pick.who': 'Who is playing?', 'pgate.title': 'Grown-ups only', 'pgate.ask': 'Answer this to continue:', 'pgate.answer': 'Answer', 'pgate.wrong': 'Not quite, here is another one.', 'pgate.makeFirst': 'Create a learner first, then open the admin link again.', 'ui.current': 'Playing now', 'ui.editProfile': 'Edit {name}', 'ui.editTitle': 'Edit profile', 'ui.save': 'Save', 'ui.cancel': 'Cancel', 'ui.saved': 'Profile saved',
  'dash.open': 'Dashboard', 'dash.title': 'Dashboard', 'dash.learners': 'Learners', 'dash.content': 'Content', 'dash.none': 'No learners yet.',
  'dash.mastered': 'Lessons mastered', 'dash.startedN': '{n} started', 'dash.acc': 'Right first time', 'dash.last7': 'last 7 days', 'dash.last30': 'last 30 days',
  'dash.streak': 'Streak', 'dash.day': 'day in a row', 'dash.days': 'days in a row', 'dash.time': 'Practice time', 'dash.active': 'Active days', 'dash.answered': 'Questions answered', 'dash.recent': 'recent answers',
  'dash.activity': 'Questions answered per day (last 14 days)', 'dash.byTrack': 'Progress by track', 'dash.attention': 'Needs attention', 'dash.accShort': '{p}% right in the last 10',
  'dash.allGood': 'Nothing needs attention right now.', 'dash.recentS': 'Recent sessions', 'dash.when': 'When', 'dash.score': 'Score', 'dash.timeS': 'Time', 'dash.noSess': 'No finished lessons yet.',
  'dash.everyone': 'All learners', 'dash.learner': 'Learner', 'dash.track': 'Track', 'dash.total': 'Total', 'dash.contentSub': '{n} lessons in the app, by track and age group.',
  'dash.multi': 'Some lessons belong to more than one age group, so the age-group columns add up to more than the total.', 'dash.byLevel': 'Lessons by level', 'flash.again': 'Watch again', 'venn.key': 'Middle = A AND B · Outside = NOT A and NOT B', 'gate.out': 'Lamp', 'gate.ask': 'Will the lamp be…', 'gate.on': 'ON', 'gate.off': 'OFF', 'rob.F': 'Forward', 'rob.L': 'Turn left', 'rob.R': 'Turn right', 'rob.run': 'Run', 'rob.clear': 'Clear', 'rob.empty': 'Tap the commands above to build your program.', 'rob.limit': 'Use at most {n} blocks.', 'rob.loops': 'Tap × on a block to repeat it.', 'bin.total': 'Total:', 'share.reset': 'Start again', 'pv.h': 'Hundreds', 'pv.t': 'Tens', 'pv.o': 'Ones', 'lvl.JK': 'Junior KG', 'lvl.SK': 'Senior KG', 'lvl.G1': 'Grade 1', 'lvl.G2': 'Grade 2', 'lvl.other': 'More games', 'lvl.x.Everyday': 'Everyday maths', 'lvl.x.Money': 'Money and finance', 'lvl.x.Tests': 'Aptitude tests', 'lvl.x.Uni': 'University topics', 'book.title': 'My sticker book', 'book.empty': 'Finish a game to win your first sticker!',
  'adm.open': 'Admin: all {n} lessons', 'adm.title': 'All topics', 'adm.sub': 'Every lesson in every mode. Try any lesson in the look of the mode it belongs to. Practice here is saved to the current learner.',
  'adm.search': 'Search lessons, levels, strands', 'adm.level': 'Level', 'adm.modes': 'Modes', 'adm.type': 'Generator', 'adm.try': 'Try', 'adm.none': 'No lessons match.'
}
};

export const LANGS = [['en', 'English']];
export const VOICE_LANG = { en: 'en-IN' };
let L = 'en';
export const lang = () => L;
export function setLang(l) { L = D[l] ? l : 'en'; document.documentElement.lang = L; }
export function t(k, v = {}) {
  const s = (D[L] && D[L][k]) ?? D.en[k] ?? k;
  return locText(s.replace(/\{(\w+)\}/g, (_, x) => v[x] ?? ''));
}
// Content fields may be a plain string or {en, hi, mr}.
export const tr = o => (o && typeof o === 'object') ? (o[L] ?? o.en) : (o ?? '');

export function timeText(h, m) {
  if (m === 0) return t('time.oclock', { h });
  if (m === 15) return `quarter past ${h}`;
  if (m === 45) return `quarter to ${h % 12 + 1}`;
  return t('time.half', { h });
}

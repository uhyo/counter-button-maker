import { CounterPageContent, BackgroundDef } from '../defs/page';
import { NewStore } from '../store/new-store';
import { firebase } from './firebase';

/**
 * Publish a new page.
 */
export async function publishCounter(id: string, content: NewStore) {
  const fb = firebase();
  const user = fb.auth().currentUser;
  if (user == null) {
    throw new Error('ログインしていません');
  }
  console.log('id:', id);
  const db = fb.firestore();
  const doc = db.collection('pages').doc(id);
  let backgroundDef: BackgroundDef;
  if (content.backgroundType === 'image' && content.backgroundImage != null) {
    // upload this to firebase storage.
    const st = fb.storage();
    const timestamp = Date.now();
    const ref = st.ref(`backgrounds/${user.uid}/${id}.${timestamp}`);
    const snapshot = await ref.put(content.backgroundImage, {
      contentType: content.backgroundImage.type,
      cacheControl: 'public, max-age=31536000, immutable',
    });
    console.log('background image is uploaded');
    const url = await ref.getDownloadURL();
    backgroundDef = {
      type: 'image',
      url,
      timestamp,
      repeat: content.backgroundRepeat,
    };
  } else if (content.backgroundType === 'gradient') {
    backgroundDef = {
      type: 'gradient',
      from: content.gradientStart,
      to: content.gradientEnd,
    };
  } else {
    backgroundDef = null;
  }
  // prepare data.
  const data: CounterPageContent = {
    id,
    uid: user.uid,
    title: content.title,
    description: content.description,
    buttonLabel: content.buttonLabel,
    buttonBg: gethex6color(content.buttonBg),
    buttonColor: gethex6color(content.buttonColor),
    background: backgroundDef,
  };
  // upload to database.
  await doc.set(data);
  console.log('page data is uploaded');
  // Initialize counter.
  const database = fb.database();
  const ref = database.ref(`counters/${id}`);
  await ref.set(0);
  console.log('counter is initialized');
}

/**
 * Generate random id.
 */
export function randomid(): string {
  // 16 bytes of randomness!
  const bytes = [];
  for (let i = 0; i < 16; i++) {
    bytes.push(String.fromCharCode(Math.floor(Math.random() * 256)));
  }
  return btoa(bytes.join(''))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// convert 3-digit hex color to 6-digit one.
function gethex6color(color: string): string {
  if (/^#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]$/.test(color)) {
    return (
      '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
    );
  } else {
    return color;
  }
}

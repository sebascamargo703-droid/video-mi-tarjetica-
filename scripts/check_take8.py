import whisper

try:
    model = whisper.load_model('base')
    print('IMG_1092:')
    r = model.transcribe('clips_seleccionados/IMG_1092.MOV')
    for s in r['segments']:
        print(f"  {s['start']:.2f} -> {s['end']:.2f}: {s['text']}")

    print('take8_cta_cierre.mp4:')
    r2 = model.transcribe('public/user_clips/take8_cta_cierre.mp4')
    for s in r2['segments']:
        print(f"  {s['start']:.2f} -> {s['end']:.2f}: {s['text']}")
except Exception as e:
    print('Whisper error:', e)

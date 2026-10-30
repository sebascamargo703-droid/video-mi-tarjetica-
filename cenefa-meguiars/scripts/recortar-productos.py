"""Recorte profesional: BiRefNet (rembg) + descontaminación de bordes + nitidez."""
import os, sys, time, numpy as np, cv2
from PIL import Image, ImageFilter
from rembg import new_session, remove

I=sys.argv[1]  # carpeta con las fotos 7.jpg … 15.jpg
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','public','productos')
JOBS={
  'kit-pulido':(7,None),'all-wheel-cleaner':(8,None),'cleaner-wax':(9,None),'linea-limpieza':(10,None),
  'ultimate-compound':(11,None),'endurance-tire-gel':(12,None),'little-joe':(13,(0,185,447,447)),
  'air-refresher':(14,(150,228,505,480)),'cleaner-wax-pasta':(15,None),
}
only=sys.argv[2:]
sess=new_session('birefnet-general')
for name,(n,crop) in JOBS.items():
    if only and name not in only: continue
    t=time.time()
    im=Image.open(f'{I}/{n}.jpg').convert('RGB')
    if crop: im=im.crop(crop)
    k=3
    up=im.resize((im.width*k,im.height*k),Image.LANCZOS)
    m=remove(up,session=sess,only_mask=True)
    a=np.asarray(m).astype(np.float32)/255.0
    # contraer un poco el borde y endurecerlo levemente (sin perder suavidad)
    a=np.clip((a-0.06)/0.88,0,1)
    a=cv2.GaussianBlur(a,(0,0),0.7)
    rgb=np.asarray(up).astype(np.float32)
    # fondo estimado: rellena el área del producto con los colores del fondo
    fg=(a>0.02).astype(np.uint8)*255
    small=cv2.resize(rgb.astype(np.uint8),(rgb.shape[1]//3,rgb.shape[0]//3),interpolation=cv2.INTER_AREA)
    msmall=cv2.resize(fg,(small.shape[1],small.shape[0]),interpolation=cv2.INTER_NEAREST)
    msmall=cv2.dilate(msmall,np.ones((5,5),np.uint8))
    bgs=cv2.inpaint(small,msmall,6,cv2.INPAINT_TELEA)
    B=cv2.resize(bgs,(rgb.shape[1],rgb.shape[0]),interpolation=cv2.INTER_CUBIC).astype(np.float32)
    al=a[...,None]
    F=(rgb-(1-al)*B)/np.maximum(al,0.08)
    edge=((a>0.01)&(a<0.97))[...,None]
    out=np.where(edge,np.clip(F,0,255),rgb)
    res=Image.fromarray(out.astype(np.uint8)).filter(ImageFilter.UnsharpMask(radius=2.5,percent=70,threshold=2))
    rgba=res.convert('RGBA'); rgba.putalpha(Image.fromarray((a*255).astype(np.uint8)))
    bbox=Image.fromarray((a>0.1).astype(np.uint8)*255).getbbox(); rgba=rgba.crop(bbox)
    if name=='air-refresher': rgba=rgba.crop((0,0,min(rgba.width,1012),rgba.height))
    rgba.save(f'{OUT}/{name}.png'); print(name,rgba.size,'%.1fs'%(time.time()-t),flush=True)

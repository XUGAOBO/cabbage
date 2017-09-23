package com.cabbagern;
import android.Manifest;
import android.content.Context;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import java.util.HashMap;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;


import java.io.*;

import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioRecord;
import android.media.AudioTrack;
import android.media.MediaRecorder;

import android.content.pm.PackageManager;
import android.os.Environment;
import android.os.AsyncTask;  
import android.media.AudioManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.util.Log;

public class Recorder extends ReactContextBaseJavaModule {

  private static final String TAG = "ReactNativeAudioRecorder";

  private static final String DocumentDirectoryPath = "DocumentDirectoryPath";
  private static final String PicturesDirectoryPath = "PicturesDirectoryPath";
  private static final String MainBundlePath = "MainBundlePath";
  private static final String CachesDirectoryPath = "CachesDirectoryPath";
  private static final String LibraryDirectoryPath = "LibraryDirectoryPath";
  private static final String MusicDirectoryPath = "MusicDirectoryPath";
  private static final String DownloadsDirectoryPath = "DownloadsDirectoryPath";


  private Context context;
  private AudioRecord  recorder;
  private String currentOutputFile;
  private boolean isRecording = false;
  private Timer timer;
  private int recorderSecondsElapsed;

  private File file;
  private OutputStream os;
  private BufferedOutputStream bos;
  private DataOutputStream dos;

  private int bufferSize;

  private RecordingTask rTask;

  public Recorder(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put(DocumentDirectoryPath, this.getReactApplicationContext().getFilesDir().getAbsolutePath());
    constants.put(PicturesDirectoryPath,  Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getAbsolutePath());
    constants.put(MainBundlePath, "");
    constants.put(CachesDirectoryPath, this.getReactApplicationContext().getCacheDir().getAbsolutePath());
    constants.put(LibraryDirectoryPath, "");
    constants.put(MusicDirectoryPath, Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC).getAbsolutePath());
    constants.put(DownloadsDirectoryPath, Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());
    return constants;
  }

  @Override
  public String getName() {
    return "Recorder";
  }

  /**
  检查权限状态
   */
  @ReactMethod
  public void checkAuthorizationStatus(Promise promise) {
    int permissionCheck = ContextCompat.checkSelfPermission(getCurrentActivity(),
            Manifest.permission.RECORD_AUDIO);
    boolean permissionGranted = permissionCheck == PackageManager.PERMISSION_GRANTED;
    promise.resolve(permissionGranted);
  }

  /**
    前期准备
   */
  @ReactMethod
  public void prepareRecordingAtPath(String recordingPath, ReadableMap recordingSettings, Promise promise) {
    if (isRecording){
      logAndRejectPromise(promise, "INVALID_STATE", "Please call stopRecording before starting recording");
    }
    try {
      int channelConfig = getChannelConfigFromString(recordingSettings.getString("channelConfig"));
      int audioEncode = getAudioEncoderFromString(recordingSettings.getString("audioEncoding"));
      bufferSize =  AudioRecord.getMinBufferSize(recordingSettings.getInt("sampleRateInHz"),channelConfig, audioEncode);
      recorder = new AudioRecord(MediaRecorder.AudioSource.MIC, recordingSettings.getInt("sampleRateInHz"),
      channelConfig, audioEncode, bufferSize);
      file = new File(recordingPath);
      if (file.exists()) {
        file.delete();
      }
      file.createNewFile();    
      os = new FileOutputStream(file);
      bos = new BufferedOutputStream(os);
      dos = new DataOutputStream(bos);
    }
    catch(final Exception e) {
      logAndRejectPromise(promise, "COULDNT_CONFIGURE_MEDIA_RECORDER" , "prepareRecorderAtPath 报错======" + e.getMessage());
      return;
    }
    currentOutputFile = recordingPath;
    promise.resolve(currentOutputFile);
  }
  /**
    获取 encorder
   */
  private int getAudioEncoderFromString(String audioEncoder) {
   switch (audioEncoder) {
     case "ENCODING_PCM_8BIT":
       return AudioFormat.ENCODING_PCM_8BIT;
     case "ENCODING_PCM_16BIT":
       return AudioFormat.ENCODING_PCM_16BIT;
     case "ENCODING_PCM_FLOAT":
       return AudioFormat.ENCODING_PCM_FLOAT;
     default:
       Log.d("INVALID_AUDIO_ENCODER", "USING MediaRecorder.AudioEncoder.DEFAULT instead of "+audioEncoder+": "+MediaRecorder.AudioEncoder.DEFAULT);
       return AudioFormat.ENCODING_PCM_16BIT;
   }
  }

  /**
    输出格式
   */
  private int getChannelConfigFromString(String channel) {
    switch (channel) {
      case "CHANNEL_IN_MONO":
        return AudioFormat.CHANNEL_IN_MONO;
      case "CHANNEL_OUT_STEREO":
        return AudioFormat.CHANNEL_OUT_STEREO;
      case "CHANNEL_OUT_FRONT_CENTER":
        return AudioFormat.CHANNEL_OUT_FRONT_CENTER;
      case "CHANNEL_OUT_QUAD":
        return AudioFormat.CHANNEL_OUT_QUAD;
      case "CHANNEL_OUT_5POINT1":
        return AudioFormat.CHANNEL_OUT_5POINT1;
      case "CHANNEL_OUT_7POINT1_SURROUND":
        return AudioFormat.CHANNEL_OUT_7POINT1_SURROUND;
      case "CHANNEL_OUT_BACK_CENTER":
        return AudioFormat.CHANNEL_OUT_BACK_CENTER;
      default:
        Log.d("INVALID_OUPUT_FORMAT", "USING MediaRecorder.OutputFormat.DEFAULT : "+MediaRecorder.OutputFormat.DEFAULT);
        return AudioFormat.CHANNEL_IN_MONO;

    }
  }

  /**
  开始录音
   */
   @ReactMethod
  public void startRecording(Promise promise){
    if (recorder == null){
      logAndRejectPromise(promise, "RECORDING_NOT_PREPARED", "Please call prepareRecordingAtPath before starting recording");
      return;
    }
    if (isRecording){
      logAndRejectPromise(promise, "INVALID_STATE", "Please call stopRecording before starting recording");
      return;
    }
    isRecording = true;
    startTimer();
    rTask = new RecordingTask();
    rTask.execute(recorder, bufferSize,dos);
    promise.resolve(currentOutputFile);
  }

  @ReactMethod
  public void stopRecording(Promise promise){
    if (!isRecording){
      logAndRejectPromise(promise, "INVALID_STATE", "Please call startRecording before stopping recording");
      return;
    }

    stopTimer();
    isRecording = false;
    rTask.cancel(true);
    recorder= null;
    rTask = null;
    promise.resolve(currentOutputFile);
    sendEvent("recordingFinished", null);
  }

  private void startTimer(){
    stopTimer();
    timer = new Timer();
    timer.scheduleAtFixedRate(new TimerTask() {
      @Override
      public void run() {
        WritableMap body = Arguments.createMap();
        body.putInt("currentTime", recorderSecondsElapsed);
        sendEvent("recordingProgress", body);
        recorderSecondsElapsed++;
      }
    }, 0, 1000);
  }

  private void stopTimer(){
    recorderSecondsElapsed = 0;
    if (timer != null) {
      timer.cancel();
      timer.purge();
      timer = null;
    }
  }
  
  private void sendEvent(String eventName, Object params) {
    getReactApplicationContext()
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
  }

  private void logAndRejectPromise(Promise promise, String errorCode, String errorMessage) {
    Log.e(TAG, errorMessage);
    promise.reject(errorCode, errorMessage);
  }

  private class RecordingTask extends AsyncTask<Object, Integer, String> {
    private AudioRecord arc;
    private int size;
    private DataOutputStream dos;
    @Override
    protected void onPreExecute() {

    }

    @Override
    protected String doInBackground(Object... params) {
      arc = (AudioRecord)params[0];
      size = (int)params[1];
      dos = (DataOutputStream)params[2];
      short[] buffer = new short[size];
      arc.startRecording();
      try {
        while (true) {
          if (isCancelled()) break;
          int bufferReadResult = arc.read(buffer, 0, size);
            for (int i = 0; i < bufferReadResult; i++) {
              dos.writeShort(buffer[i]);
            }
        }
        arc.stop();
        arc.release();
        dos.close();
      } catch (Throwable t) {
              Log.e(TAG, "录音失败");
      }
      return null;
    }

    @Override
    protected void onProgressUpdate(Integer... progress) {

    }

    @Override
    protected void onPostExecute(String result) {

    }

    @Override
    protected void onCancelled() {
      try{
        arc.stop();
        arc.release();
        dos.close();
        arc = null;
      } catch(Exception e ) {
         Log.e(TAG, e.getMessage());  
      } 
    }
  }

}



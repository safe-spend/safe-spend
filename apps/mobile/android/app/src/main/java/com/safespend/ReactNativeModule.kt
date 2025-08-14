package com.safespend

import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.tom_roush.pdfbox.pdmodel.PDDocument
import com.tom_roush.pdfbox.text.PDFTextStripper

class ReactNativeModule(context: ReactApplicationContext): ReactContextBaseJavaModule(context){
    override fun getName(): String = "ReactNativeModule"

    @ReactMethod
    fun readPdfFile(base64EncodedFile: String, password: String?, promise: Promise) {
        try {
            log("readPdfFile called")
            val pages = Arguments.createArray();

            log("Decoding base64 PDF")
            val bytes = Base64.decode(base64EncodedFile, Base64.DEFAULT)

            log("Opening PDF with PDFBox")
            val stripper = PDFTextStripper()

            PDDocument.load(bytes, password).use { document ->
                log("PDF opened successfully, number of pages: ${document.numberOfPages}")
                for (i in 1..document.numberOfPages) {
                    stripper.startPage = i
                    stripper.endPage = i
                    log("Extracting text from page $i")
                    val text = stripper.getText(document)
                    val lines = text
                        .split("\r?\n".toRegex())
                        .map { it.trim() }
                        .filter { it.isNotEmpty() }

                    pages.pushArray(Arguments.makeNativeArray<String>(lines.toTypedArray()))
                }

                log("Text extraction complete, extracted ${pages.size()} pages")
            }

            promise.resolve(pages)
        } catch (e: Exception) {
            log("Error extracting text: ${e.message}")
            promise.reject(e)
        }
    }

    private fun log(message: String) {
        Log.d(this.name, message)
    }
}
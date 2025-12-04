package com.superproductivity.superproductivity.widget

import android.content.Context
import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.File

@CapacitorPlugin(name = "TodayWidget")
class TodayWidgetPlugin : Plugin() {
    @PluginMethod
    fun updateTasks(call: PluginCall) {
        val tasks = call.getArray("tasks")
        if (tasks == null) {
            call.reject("No tasks provided")
            return
        }

        try {
            val context = this.context
            val fileName = "today-widget-tasks.json"
            val file = File(context.filesDir, fileName)
            file.writeText(tasks.toString())
            Log.d("TodayWidgetPlugin", "Tasks updated successfully")

            // Trigger widget update
            val appWidgetManager = AppWidgetManager.getInstance(context)
            val componentName = ComponentName(context, TodayWidgetProvider::class.java)
            val appWidgetIds = appWidgetManager.getAppWidgetIds(componentName)
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetIds, R.id.task_list)

            call.resolve()
        } catch (e: Exception) {
            call.reject("Error saving tasks", e)
        }
    }
}

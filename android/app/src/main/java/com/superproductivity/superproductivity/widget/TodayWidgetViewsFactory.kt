package com.superproductivity.superproductivity.widget

import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import com.superproductivity.superproductivity.R
import org.json.JSONArray
import java.io.File

class TodayWidgetViewsFactory(
    private val context: Context,
    intent: Intent
) : RemoteViewsService.RemoteViewsFactory {

    private val taskList = mutableListOf<String>()

    override fun onCreate() {
        onDataSetChanged()
    }

    override fun onDataSetChanged() {
        taskList.clear()
        try {
            val fileName = "today-widget-tasks.json"
            val file = File(context.filesDir, fileName)
            if (file.exists()) {
                val jsonString = file.readText()
                val jsonArray = JSONArray(jsonString)
                for (i in 0 until jsonArray.length()) {
                    val task = jsonArray.getJSONObject(i)
                    taskList.add(task.getString("title"))
                }
            }
        } catch (e: Exception) {
            // Log error or handle exception
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        taskList.clear()
    }

    override fun getCount(): Int {
        return taskList.size
    }

    override fun getViewAt(position: Int): RemoteViews {
        // We construct a remote views item based on our layout file
        val views = RemoteViews(context.packageName, R.layout.today_widget_list_item)
        views.setTextViewText(R.id.task_title, taskList[position])
        return views
    }


    override fun getLoadingView(): RemoteViews? {
        // You can create a custom loading view (for instance when cursor is loading data).
        return null
    }

    override fun getViewTypeCount(): Int {
        return 1
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    override fun hasStableIds(): Boolean {
        return true
    }
}

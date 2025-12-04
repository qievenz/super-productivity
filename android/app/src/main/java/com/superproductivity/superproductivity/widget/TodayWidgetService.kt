package com.superproductivity.superproductivity.widget

import android.content.Context
import android.content.Intent
import android.widget.RemoteViews
import android.widget.RemoteViewsService
import com.superproductivity.superproductivity.R

class TodayWidgetService : RemoteViewsService() {
    override fun onGetViewFactory(intent: Intent): RemoteViewsFactory {
        return TodayViewsFactory(this.applicationContext)
    }
}

class TodayViewsFactory(private val context: Context) : RemoteViewsService.RemoteViewsFactory {
    // TODO: Replace with actual data fetching
    private val widgetItems = listOf("Task 1", "Task 2", "Task 3", "Another Task", "Final Task")

    override fun onCreate() {
        // Connect to data source
    }

    override fun onDataSetChanged() {
        // Refresh data
    }

    override fun onDestroy() {
        // Close data source connection
    }

    override fun getCount(): Int {
        return widgetItems.size
    }

    override fun getViewAt(position: Int): RemoteViews {
        // Create a remote view for each item
        return RemoteViews(context.packageName, R.layout.today_widget_list_item).apply {
            setTextViewText(R.id.widget_list_item_text, widgetItems[position])
        }
    }

    override fun getLoadingView(): RemoteViews? {
        return null // Use default loading view
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
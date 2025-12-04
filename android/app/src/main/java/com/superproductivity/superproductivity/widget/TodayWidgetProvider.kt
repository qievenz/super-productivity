package com.superproductivity.superproductivity.widget

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews
import com.superproductivity.superproductivity.R
import com.superproductivity.superproductivity.FullscreenActivity

class TodayWidgetProvider : AppWidgetProvider() {

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // Perform this loop procedure for each App Widget that belongs to this provider
        appWidgetIds.forEach { appWidgetId ->
            // Create an Intent to launch FullscreenActivity
            val pendingIntent: PendingIntent = Intent(context, FullscreenActivity::class.java)
                .let { intent ->
                    PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE)
                }

            // Set up the intent that starts the TodayWidgetService, which will
            // provide the views for this collection.
            val intent = Intent(context, TodayWidgetService::class.java).apply {
                // Add the app widget ID to the intent extras.
                putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
                data = Uri.parse(toUri(Intent.URI_INTENT_SCHEME))
            }

            val views: RemoteViews = RemoteViews(
                context.packageName,
                R.layout.today_widget
            ).apply {
                // Set up the collection
                setRemoteAdapter(R.id.widget_task_list, intent)

                // Set the action for the add task button
                setOnClickPendingIntent(R.id.widget_add_task_button, pendingIntent)

                // TODO: Set up pending intent template for list items
            }

            // Tell the AppWidgetManager to perform an update on the current app widget
            appWidgetManager.updateAppWidget(appWidgetId, views)
            appWidgetManager.notifyAppWidgetViewDataChanged(appWidgetId, R.id.widget_task_list)
        }
    }
}
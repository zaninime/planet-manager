package eu.elos.planetmgr.app;

import android.support.v7.app.AppCompatDelegate;

public class Application extends android.app.Application {
    @Override
    public void onCreate() {
        super.onCreate();
        AppCompatDelegate.setCompatVectorFromResourcesEnabled(true);
    }
}

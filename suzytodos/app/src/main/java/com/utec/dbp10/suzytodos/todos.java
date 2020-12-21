package com.utec.dbp10.suzytodos;

import androidx.annotation.MainThread;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.util.Pair;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.aware.PublishConfig;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.HashMap;

public class todos extends AppCompatActivity {

    public static final String EXTRA_TEXT = "com.utec.dbp10.suzytodos.EXTRA_TEXT";
    public static final String EXTRA_ARRAY = "com.utec.dbp10.suzytodos.EXTRA_ARRAY";
    public static final String EXTRA_KEY = "com.utec.dbp10.suzytodos.EXTRA_POS";

    ArrayList<String> todos = new ArrayList<String>();
    ArrayAdapter<String> todosAdapter;
    ListView listView;
    String username;
    HashMap<String, ArrayList<String>> table;
    String key;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_todos);
        Intent intent = getIntent();
        username = intent.getStringExtra(MainActivity.EXTRA_TEXT);
        table = (HashMap<String, ArrayList<String>>) intent.getSerializableExtra(MainActivity.EXTRA_ARRAY);
        key = intent.getStringExtra(MainActivity.EXTRA_KEY);
        todos = table.get(key);
        TextView welcome = findViewById(R.id.welcome);
        String welcomemsg = welcome.getText().toString();
        welcomemsg += " " + username;
        welcome.setText(welcomemsg);
        listView = findViewById(R.id.list);
        todosAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, todos);
        listView.setAdapter(todosAdapter);
        setUpListViewListener();
    }


    private void setUpListViewListener() {
        listView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                Context context = getApplicationContext();
                String hint = getString(R.string.tododelete);
                Toast.makeText(context, hint, Toast.LENGTH_LONG).show();
                todos.remove(position);
                todosAdapter.notifyDataSetChanged();
                return true;
            }
        });
    }

    public void addTodo(View view) {
        EditText adder = findViewById(R.id.adder);
        String todoDescription = adder.getText().toString();
        if(!(todoDescription.equals(""))) {
            todosAdapter.add(todoDescription);
            adder.setText("");
        }
        else {
            String hint = getString(R.string.tododesc);
            Toast.makeText(getApplicationContext(), hint, Toast.LENGTH_LONG).show();
        }
    }

    public void logout(View veiw) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }

    public void abrirtables(View veiw) {
        Intent intent = new Intent(this, tables.class);
        intent.putExtra(EXTRA_TEXT, username);
        intent.putExtra(EXTRA_ARRAY, table);
        startActivity(intent);
    }

}

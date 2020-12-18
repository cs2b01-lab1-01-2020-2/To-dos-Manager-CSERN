package com.utec.dbp10.suzytodos;

import androidx.annotation.MainThread;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.net.wifi.aware.PublishConfig;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;

public class todos extends AppCompatActivity {

    ArrayList<String> todos;
    ArrayAdapter<String> todosAdapter;
    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_todos);

        Intent intent = getIntent();
        String username = intent.getStringExtra(MainActivity.EXTRA_TEXT);
        TextView welcome = findViewById(R.id.welcome);
        welcome.setText(String.format("Welcome %s", username));

        listView = findViewById(R.id.list);
        todos = new ArrayList<>();
        todosAdapter = new ArrayAdapter<>(this, android.R.layout.simple_list_item_1, todos);
        listView.setAdapter(todosAdapter);
        setUpListViewListener();
    }

    private void setUpListViewListener() {
        listView.setOnItemLongClickListener(new AdapterView.OnItemLongClickListener() {
            @Override
            public boolean onItemLongClick(AdapterView<?> parent, View view, int position, long id) {
                Context context = getApplicationContext();
                Toast.makeText(context, "Todo deleted", Toast.LENGTH_LONG).show();

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
            Toast.makeText(getApplicationContext(), "Todo needs a description", Toast.LENGTH_LONG).show();
        }
    }

    public void logout(View veiw) {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
    }
}
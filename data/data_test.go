package data

import (
	"encoding/json"
	"os"
	"os/exec"
	"testing"

	"github.com/go-xorm/xorm"
)

func init() {
	exec.Command("rm", "test.db").Run()
}

func TestDatabase(t *testing.T) {
	t.Log("Create a pognon on database")

	engine, err := xorm.NewEngine("sqlite3", "./test.db")
	if err != nil {
		t.Fatal(err)
	}

	err = engine.Sync2(new(Transaction), new(Pognon))
	if err != nil {
		t.Fatal(err)
	}

	p := Pognon{IDPognon: 1, Participants: []string{"a", "b", "c", "d"}, PognonHash: "abcdefgh"}
	_, err = engine.Insert(p)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote pognon to database")

	t1 := Transaction{IDPognon: 1,
		Buyers: []Purchase{{"a", 10.25}},
		Payers: []Purchase{{"a", 5}, {"c", 3}, {"a", 2.25}},
		Reason: "love"}
	_, err = engine.Insert(t1)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote transaction to database")
	t.Log("Getting value back")
	var value = Transaction{IDTransaction: 1}
	_, err = engine.Get(&value)
	if err != nil {
		t.Fatal(err)
	}
	json, _ := json.MarshalIndent(&value, "", "\t")
	os.Stdout.Write(json)

	t2 := Transaction{IDPognon: 1,
		Buyers: []Purchase{{"a", 5.4}},
		Payers: []Purchase{{Person: "a"}, {Person: "b"}, {Person: "c"}},
		Reason: "bus"}
	_, err = engine.Insert(t2)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Wrote transaction to database")

}

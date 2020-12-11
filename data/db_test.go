package data

import (
	"os/exec"
	"testing"
)

func init() {
	// Delete any existing database file before running test
	exec.Command("rm", "test2.db").Run()
}

func TestDeletePerson(t *testing.T) {
	t.Log("Creating a new pognon")

	var pognon = Pognon{IDPognon: 1, PognonHash: "abcdefgh"}
	var participants = []Person{{IDPerson: 1, Name: "toma", PognonHash: "abcdefgh"}}
	var transaction = Transaction{
		Buyers: []Purchase{{1, 10.25, false}},
		For:    []Purchase{{1, 0, true}},
		Reason: "love",
	}

	var pognonJSON = PognonJSON{
		&pognon,
		&participants,
		nil,
	}

	engine, err := GetEngine("test2.db")
	if err != nil {
		t.Fatal(err)
	}
	engine.ShowSQL(true)

	err = WritePognon(engine, &pognonJSON)
	if err != nil {
		t.Fatal(err)
	}

	t.Log("Succesfully created pognon")

	t.Log("Add a transaction")
	err = WriteTransaction(engine, &transaction)
	if err != nil {
		t.Fatal(err)
	}
	t.Log("Sucessfully added a transaction")

	t.Log("Trying to delete IDPerson 1")

	err = DeletePerson(engine, "abcdefgh", 1)
	if err == nil || err.Error() != "Cannot delete. This person is involved in transactions" {
		t.Fatal("Wrong error", err)
	}

	t.Log("Returned the correct error")

	t.Log("Delete the transaction")
	err = DeleteTransaction(engine, 1)
	if err != nil {
		t.Fatal(err)
	}

	t.Log("Delete the person")
	err = DeletePerson(engine, "abcdefgh", 1)
	if err != nil {
		t.Fatal(err)
	}

}

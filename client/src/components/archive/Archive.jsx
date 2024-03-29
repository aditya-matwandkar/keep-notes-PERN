import React, { useContext, useState } from "react";
import { styled } from "@mui/material";
import { Card, CardActions, CardContent, Typography } from "@mui/material";
import { UnarchiveOutlined, DeleteOutlined } from "@mui/icons-material";
import { DataContext } from "../../context/DataProvider";
import { Slide, toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";

const StyledCard = styled(Card)`
  width: 280px;
  margin: 8px;
  box-shadow: none;
  border: 1px solid #e0e0e0;
  border-radius: 8px;

  &:hover {
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
`;

function Archive({ note }) {
  const { setNotes, setDeletedNotes } = useContext(DataContext);

  const [loading, setLoading] = useState(true);

  // Function to unarchive the note
  const unarchiveNote = async (note) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/archives/unarchive",
        {
          id: note.note_id,
        }
      );
      setNotes(response.data);
      toast.success("Note unarchived", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
        transition: Slide,
      });
    } catch (err) {
      console.error("Error archiving data:", err);
      toast.error("Error unarchiving data", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to move note in trash
  const deleteNote = async (note) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/archives/trash",
        {
          id: note.note_id,
        }
      );
      setDeletedNotes(response.data);
      toast.info("Note deleted", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
        transition: Slide,
      });
    } catch (err) {
      console.error("Error deleting data:", err);
      toast.error("Error deleting note", {
        position: "bottom-left",
        autoClose: 3000,
        hideProgressBar: true,
        theme: "colored",
        transition: Slide,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StyledCard>
        <Link
          to={"/archives/" + note.note_id}
          style={{
            textDecoration: "none",
            color: "inherit",
            cursor: "default",
          }}
        >
          <CardContent>
            <Typography
              style={{
                fontSize: "1.5rem",
                marginBottom: "16px",
                fontFamily: "Open sans",
                marginTop: "-8px",
              }}
            >
              {note.title}
            </Typography>
            <Typography
              style={{
                fontFamily: "Open sans",
                whiteSpace: "pre-wrap",
                maxHeight: "380px",
                overflow: "hidden",
              }}
            >
              {note.content}
            </Typography>
          </CardContent>
        </Link>
        <CardActions>
          <UnarchiveOutlined
            titleAccess="Unarchive"
            fontSize="small"
            style={{ marginLeft: "auto", cursor: "pointer" }}
            onClick={() => unarchiveNote(note)}
          />
          <DeleteOutlined
            titleAccess="Move to trash"
            fontSize="small"
            style={{ cursor: "pointer" }}
            onClick={() => deleteNote(note)}
          />
        </CardActions>
      </StyledCard>
    </>
  );
}

export default Archive;

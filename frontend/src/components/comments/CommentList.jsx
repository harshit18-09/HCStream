import { Stack } from "@mui/material";
import CommentItem from "./CommentItem";

const CommentList = ({ comments, onEdit, onDelete }) => (
  <Stack spacing={2}>
    {comments?.map((comment) => (
      <CommentItem key={comment._id} comment={comment} onEdit={onEdit} onDelete={onDelete} />
    ))}
  </Stack>
);

export default CommentList;

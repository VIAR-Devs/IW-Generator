import { useState } from 'react';
import SaveProgressDialog from '../SaveProgressDialog';
import { Button } from '@/components/ui/button';

export default function SaveProgressDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Open Save Progress Dialog</Button>
      <SaveProgressDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={(email, password) => {
          console.log('Account created:', email);
          setOpen(false);
        }}
      />
    </div>
  );
}

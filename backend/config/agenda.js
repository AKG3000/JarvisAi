import Agenda from 'agenda';
import dotenv from 'dotenv';

dotenv.config();

const mongoConnectionString = 'mongodb+srv://ankitgujar2718:GOxttj58VgL1a0WZ@cluster0.4en8r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const agenda = new Agenda({ db: { address: mongoConnectionString } });

agenda.define('send notification', async (job) => {
    const { task } = job.attrs.data;
    console.log(`Sending notification for task: ${task}`);
});

export const startAgenda = async () => {
    await agenda.start();
    console.log('Agenda job scheduler started');
};

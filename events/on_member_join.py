import discord

def on_member_join_event(role_id: int):
    async def on_member_join(member: discord.Member):
        role = member.guild.get_role(role_id)
        if role:
            await member.add_roles(role, reason="Auto role on join")
            print(f"[INFO] Assigned role '{role.name}' to {member.name}")
        else:
            print(f"[ERROR] Role with ID {role_id} not found.")
    return on_member_join
